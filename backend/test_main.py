import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_get_current_state():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/state")
    assert response.status_code == 200
    data = response.json()
    assert "crowd_density" in data
    assert "wait_times" in data
    assert "alerts" in data
    assert "section_a" in data["crowd_density"]

@pytest.mark.asyncio
async def test_trigger_sos():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Valid SOS POST
        valid_payload = {"location": "North Gate", "user_id": "guard_123"}
        response = await ac.post("/api/sos", json=valid_payload)
        assert response.status_code == 200
        assert response.json() == {"status": "dispatched", "message": "Help is on the way."}
        
        # Invalid validation SOS POST
        invalid_payload = {"location": "N", "user_id": "guard!!!123"}
        response_invalid = await ac.post("/api/sos", json=invalid_payload)
        assert response_invalid.status_code == 422
