import pytest
from datetime import datetime

EVENT_PATH = "/event/management"
fields_to_check = ['name', 'description', 'location', 'skills', 'urgency', 'date'] 

# Convert dates to test methods
def convert_date(date_string):
    dt_object = datetime.strptime(date_string, '%a, %d %b %Y %H:%M:%S %Z')
    return dt_object.strftime('%m/%d/%Y')

def test_get_empty_event(auth_client):
    response = auth_client.get(EVENT_PATH)
    assert response.status_code == 404

def test_update_event(auth_client, event):
    response = auth_client.post(EVENT_PATH, json=event)
    assert response.status_code == 200
    assert response.json == {"msg": "Event saved successfully!"}

    response = auth_client.get(EVENT_PATH)
    assert response.status_code == 200
    for field in fields_to_check:
        assert response.json[field] == event[field], f"{field.capitalize()} does not match!"
def test_update_invalid_event(auth_client, invalid_event):
    response = auth_client.put(EVENT_PATH, json=invalid_event)
    assert response.status_code == 400
    assert "errors" in response.json

# @pytest.mark.parametrize("updated_event_info", [
#     {
#         "name": "Computer Science Fundraising",
#         "description": "Fundraising and workshop",
#         "location": "9999 Hazen St, Sugar Land, Texas 77899",
#         "skills": ["Adaptive", "Problem-Solving", "Teamwork"],
#         "urgency": "Medium",
#         "date": "10/11/2024",
#     }
# ])