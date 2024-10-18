import pytest
from datetime import datetime

# Convert dates to test methods
def convert_date(date_string):
    dt_object = datetime.strptime(date_string, '%a, %d %b %Y %H:%M:%S %Z')
    return dt_object.strftime('%m/%d/%Y')

def test_get_empty_profile(auth_client):
    response = auth_client.get("/user/profile")
    assert response.status_code == 404

def test_update_valid_profile(auth_client, valid_profile):
    response = auth_client.put("/user/profile", json=valid_profile)
    assert response.status_code == 200
    assert response.json == {"msg": "Profile saved successfully!"}

    response = auth_client.get("/user/profile")
    assert response.status_code == 200
    fields_to_check = ['name', 'address1', 'address2', 'city', 'state', 'zipcode', 'skills', 'preferences']
    for field in fields_to_check:
        assert response.json[field] == valid_profile[field], f"{field.capitalize()} does not match!"
    converted_dates = [convert_date(date) for date in response.json['dates']]
    assert converted_dates == valid_profile['dates'], "Dates do not match!"

def test_update_invalid_profile(auth_client, invalid_profile):
    response = auth_client.put("/user/profile", json=invalid_profile)
    assert response.status_code == 400
    assert "errors" in response.json

@pytest.mark.parametrize("updated_profile", [
    {
        "name": "Barton",
        "address1": "234 Main St",
        "address2": "Apt 2",
        "city": "Another City",
        "state": "CA",
        "zipcode": "67890",
        "skills": ["skill2", "skill3"],
        "preferences": "Some preferences",
        "dates": ["10/11/2024", "11/10/2024"]
    }
])
def test_get_updated_profile(auth_client, updated_profile):
    auth_client.put("/user/profile", json=updated_profile)

    response = auth_client.get("/user/profile")
    assert response.status_code == 200
    fields_to_check = ['name', 'address1', 'address2', 'city', 'state', 'zipcode', 'skills', 'preferences']
    for field in fields_to_check:
        assert response.json[field] == updated_profile[field], f"{field.capitalize()} does not match!"

    converted_dates = [convert_date(date) for date in response.json['dates']]
    assert converted_dates == updated_profile['dates'], "Dates do not match!"