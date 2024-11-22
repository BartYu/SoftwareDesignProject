from flask import Blueprint, request, jsonify, make_response
import csv
import io
from fpdf import FPDF
from datetime import datetime
from flask import current_app as app

report_bp = Blueprint('report', __name__)

@report_bp.route('/generate_report', methods=['GET', 'POST'])
def generate_report():
    cursor = report_bp.mysql.connection.cursor()

    report_format = request.form.get('format')
    report_type = request.form.get('report_type')

    if report_type == "volunteer_events_report":
        query = """
            SELECT v.volunteer_full_name, e.event_name
            FROM volunteer v
            JOIN volunteer_history vh ON v.volunteer_id = vh.volunteer_id
            JOIN event e ON e.event_id = vh.finished_event_id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        report_data = [{"Volunteer Name": row[0], "Event": row[1]} for row in rows]

    elif report_type == "event_details_report":
        query = """
            SELECT e.event_name, e.event_date, e.event_description, e.event_address, 
                   e.event_zipcode, e.event_city, s.state_name
            FROM event e
            JOIN state s ON e.event_state = s.state_id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        report_data = [{"event_name": row[0], 
                        "event_date": row[1].strftime('%B %d, %Y'), 
                        "event_description": row[2], 
                        "event_address": row[3], 
                        "event_zipcode": row[4], 
                        "event_city": row[5], 
                        "event_state": row[6]} for row in rows]

    cursor.close()

    if report_format == 'csv':
        return generate_csv(report_data, report_type)
    elif report_format == 'pdf':
        return generate_pdf(report_data, report_type)
    else:
        return jsonify({"error": "Invalid format"}), 400

def generate_csv(data, report_type):
    output = io.StringIO()

    if report_type == "event_details_report":
        fieldnames = ['Name', 'Date', 'Description', 'Address', 'Zipcode', 'City', 'State']
    else:
        fieldnames = data[0].keys()  

    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()

    if report_type == "event_details_report":
        for row in data:
            row['Name'] = row.pop('event_name', '')
            row['Date'] = row.pop('event_date', '')
            row['Description'] = row.pop('event_description', '')
            row['Address'] = row.pop('event_address', '')
            row['Zipcode'] = row.pop('event_zipcode', '')
            row['City'] = row.pop('event_city', '')
            row['State'] = row.pop('event_state', '')

    writer.writerows(data)

    output.seek(0)
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv'
    filename = f"{report_type}.csv"
    response.headers['Content-Disposition'] = f"attachment; filename={filename}"
    
    return response


def generate_pdf(data, report_type):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.set_font("Arial", size=16, style='B')
    pdf.cell(200, 10, txt=f"{report_type.replace('_', ' ').title()}", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", size=12)

    if report_type == 'volunteer_events_report':
        pdf.set_font("Arial", size=12, style='B')  
        pdf.cell(90, 10, 'Volunteer Name', border=1, align='C') 
        pdf.cell(90, 10, 'Event', border=1, align='C') 
        pdf.ln()  

        pdf.set_font("Arial", size=12)  
        for row in data:
            pdf.cell(90, 10, row['Volunteer Name'], border=1, align='C')  
            pdf.cell(90, 10, row['Event'], border=1, align='C')  
            pdf.ln()  

    elif report_type == 'event_details_report':
        for row in data:
            pdf.multi_cell(0, 10, f"Event Name: {row['event_name']}\nDate: {row['event_date']}\nDescription: {row['event_description']}\nAddress: {row['event_address']}, {row['event_zipcode']} {row['event_city']}, {row['event_state']}\n\n")

    pdf_output = pdf.output(dest='S').encode('latin1')
    response = make_response(pdf_output)
    response.headers['Content-Type'] = 'application/pdf'
    filename = f"{report_type}.pdf"
    response.headers['Content-Disposition'] = f"attachment; filename={filename}"
    return response
