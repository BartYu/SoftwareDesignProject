import pytest
from datetime import datetime

EVENT_PATH = "/event/management"
fields_to_check = ['name', 'description', 'location', 'skills', 'urgency', 'date'] 

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