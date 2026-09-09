"""
Simulink Queue & Resource Capacity Simulation API Endpoint.
"""

from fastapi import APIRouter
from app.schemas.simulation import SimulationInputParams, SimulationResult
from app.services.simulink_service import run_discrete_event_simulation

router = APIRouter()

@router.post("/simulation/run", response_model=SimulationResult)
def run_simulation(params: SimulationInputParams):
    """Executes discrete-event capacity simulation for rural district health network."""
    return run_discrete_event_simulation(params)
