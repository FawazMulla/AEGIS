from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class GraphRepository(ABC):
    @abstractmethod
    def get_topology(self, project_id: str = "demo") -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_node(self, node_id: str, project_id: str = "demo") -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_predecessors(self, node_id: str, project_id: str = "demo") -> List[str]:
        pass

    @abstractmethod
    def get_successors(self, node_id: str, project_id: str = "demo") -> List[str]:
        pass

    @abstractmethod
    def get_subgraph(self, service_id: str, hops: int = 2, project_id: str = "demo") -> Dict[str, Any]:
        pass

    @abstractmethod
    def add_incident(self, service_id: str, description: str, decision_data: Dict[str, Any], project_id: str = "demo") -> str:
        pass

    @abstractmethod
    def get_incidents(self, service_id: str, days: int = 30, project_id: str = "demo") -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def reset_to_seed(self, project_id: str = "demo") -> None:
        pass
