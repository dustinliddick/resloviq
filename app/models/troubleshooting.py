from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Optional
import uuid

@dataclass
class IssueInfo:
    title: str = ""
    server: str = ""
    symptoms: str = ""
    priority: str = "Medium"
    
    def to_dict(self) -> dict:
        return {
            'title': self.title,
            'server': self.server,
            'symptoms': self.symptoms,
            'priority': self.priority
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'IssueInfo':
        return cls(
            title=data.get('title', ''),
            server=data.get('server', ''),
            symptoms=data.get('symptoms', ''),
            priority=data.get('priority', 'Medium')
        )

@dataclass
class Step:
    id: int
    command: str = ""
    output: str = ""
    analysis: str = ""
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'command': self.command,
            'output': self.output,
            'analysis': self.analysis,
            'timestamp': self.timestamp
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Step':
        return cls(
            id=data['id'],
            command=data.get('command', ''),
            output=data.get('output', ''),
            analysis=data.get('analysis', ''),
            timestamp=data.get('timestamp', datetime.now().isoformat())
        )

@dataclass
class Resolution:
    root_cause: str = ""
    solution: str = ""
    fix_commands: str = ""
    verification: str = ""
    prevention: str = ""
    
    def to_dict(self) -> dict:
        return {
            'root_cause': self.root_cause,
            'solution': self.solution,
            'fix_commands': self.fix_commands,
            'verification': self.verification,
            'prevention': self.prevention
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Resolution':
        return cls(
            root_cause=data.get('root_cause', ''),
            solution=data.get('solution', ''),
            fix_commands=data.get('fix_commands', ''),
            verification=data.get('verification', ''),
            prevention=data.get('prevention', '')
        )

@dataclass
class TroubleshootingSession:
    session_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    issue_info: IssueInfo = field(default_factory=IssueInfo)
    steps: List[Step] = field(default_factory=list)
    resolution: Resolution = field(default_factory=Resolution)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    completed_at: Optional[datetime] = None
    
    def add_step(self, command: str = "", output: str = "", analysis: str = "") -> Step:
        step_id = len(self.steps) + 1
        step = Step(id=step_id, command=command, output=output, analysis=analysis)
        self.steps.append(step)
        return step
    
    def remove_step(self, step_id: int) -> bool:
        original_length = len(self.steps)
        self.steps = [step for step in self.steps if step.id != step_id]
        return len(self.steps) < original_length
    
    def to_dict(self) -> dict:
        return {
            'session_id': self.session_id,
            'issue_info': self.issue_info.to_dict(),
            'steps': [step.to_dict() for step in self.steps],
            'resolution': self.resolution.to_dict(),
            'created_at': self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'TroubleshootingSession':
        session = cls(
            session_id=data.get('session_id', str(uuid.uuid4())),
            issue_info=IssueInfo.from_dict(data.get('issue_info', {})),
            resolution=Resolution.from_dict(data.get('resolution', {})),
            created_at=data.get('created_at', datetime.now().isoformat())
        )
        session.steps = [Step.from_dict(step_data) for step_data in data.get('steps', [])]
        return session