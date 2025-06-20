from datetime import datetime
from typing import Optional, Dict, Any
from app.models.troubleshooting import TroubleshootingSession, IssueInfo, Step, Resolution

class TroubleshootingService:
    def __init__(self):
        self.sessions: Dict[str, TroubleshootingSession] = {}
    
    def create_session(self) -> TroubleshootingSession:
        session = TroubleshootingSession()
        self.sessions[session.session_id] = session
        return session
    
    def get_session(self, session_id: str) -> Optional[TroubleshootingSession]:
        return self.sessions.get(session_id)
    
    def update_issue_info(self, session_id: str, issue_data: Dict[str, Any]) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False
        
        session.issue_info = IssueInfo.from_dict(issue_data)
        return True
    
    def add_step(self, session_id: str, command: str = "", output: str = "", analysis: str = "") -> Optional[Step]:
        session = self.get_session(session_id)
        if not session:
            return None
        
        if not command.strip() and not output.strip():
            return None
        
        return session.add_step(command, output, analysis)
    
    def remove_step(self, session_id: str, step_id: int) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False
        
        return session.remove_step(step_id)
    
    def update_resolution(self, session_id: str, resolution_data: Dict[str, Any]) -> bool:
        session = self.get_session(session_id)
        if not session:
            return False
        
        session.resolution = Resolution.from_dict(resolution_data)
        return True
    
    def generate_report(self, session_id: str) -> Optional[str]:
        session = self.get_session(session_id)
        if not session:
            return None
        
        return self._generate_markdown_report(session)
    
    def _generate_markdown_report(self, session: TroubleshootingSession) -> str:
        timestamp = datetime.now().strftime('%Y-%m-%d')
        time_string = datetime.now().strftime('%H:%M:%S')
        
        report = f"# Troubleshooting Report - {session.issue_info.title or 'Server Issue'}\n\n"
        report += f"**Date:** {timestamp} {time_string}\n"
        report += f"**Server/Environment:** {session.issue_info.server}\n"
        report += f"**Initial Symptoms:** {session.issue_info.symptoms}\n"
        report += f"**Priority:** {session.issue_info.priority}\n\n"
        
        if session.steps:
            report += "## Investigation Steps\n\n"
            
            for step in session.steps:
                report += f"### Step {step.id}: Investigation\n\n"
                
                if step.command:
                    report += f"**Command/Action:**\n```bash\n{step.command}\n```\n\n"
                
                if step.output:
                    report += f"**Output/Result:**\n```\n{step.output}\n```\n\n"
                
                if step.analysis:
                    report += f"**Analysis:** {step.analysis}\n\n"
                
                report += "---\n\n"
        
        if (session.resolution.root_cause or session.resolution.solution or 
            session.resolution.fix_commands or session.resolution.verification or 
            session.resolution.prevention):
            
            report += "## Resolution Summary\n\n"
            
            if session.resolution.root_cause:
                report += f"**Root Cause:** {session.resolution.root_cause}\n\n"
            
            if session.resolution.solution:
                report += f"**Solution Applied:** {session.resolution.solution}\n\n"
            
            if session.resolution.fix_commands:
                report += f"**Resolution Commands:**\n```bash\n{session.resolution.fix_commands}\n```\n\n"
            
            if session.resolution.verification:
                report += f"**Verification Steps:**\n{session.resolution.verification}\n\n"
            
            if session.resolution.prevention:
                report += f"**Prevention/Future Monitoring:** {session.resolution.prevention}\n\n"
            
            report += f"**Time to Resolution:** {len(session.steps)} investigation steps\n"
            report += f"**Total Investigation Time:** {timestamp} {time_string}\n\n"
        
        return report
    
    def reset_session(self, session_id: str) -> bool:
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    def generate_rca_report(self, session_id: str) -> Optional[str]:
        """Generate an RCA-specific report for completion"""
        session = self.get_session(session_id)
        if not session:
            return None
        
        # Mark the session as completed
        session.completed_at = datetime.now()
        return self._generate_rca_document(session)
    
    def generate_rca_document(self, session_id: str) -> Optional[str]:
        """Generate downloadable RCA document"""
        session = self.get_session(session_id)
        if not session:
            return None
        
        return self._generate_rca_document(session)
    
    def _generate_rca_document(self, session: TroubleshootingSession) -> str:
        """Generate a comprehensive RCA document"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Header
        rca_doc = "=" * 80 + "\n"
        rca_doc += "ROOT CAUSE ANALYSIS (RCA) REPORT\n"
        rca_doc += "=" * 80 + "\n\n"
        
        # Executive Summary
        rca_doc += "EXECUTIVE SUMMARY\n"
        rca_doc += "-" * 20 + "\n"
        rca_doc += f"Issue Title: {session.issue_info.title or 'Server Issue'}\n"
        rca_doc += f"Server/Environment: {session.issue_info.server}\n"
        rca_doc += f"Priority Level: {session.issue_info.priority}\n"
        rca_doc += f"Report Generated: {timestamp}\n"
        rca_doc += f"Investigation Steps: {len(session.steps)}\n\n"
        
        # Problem Statement
        rca_doc += "PROBLEM STATEMENT\n"
        rca_doc += "-" * 20 + "\n"
        rca_doc += f"Initial Symptoms: {session.issue_info.symptoms}\n\n"
        
        # Root Cause Analysis
        if session.resolution.root_cause:
            rca_doc += "ROOT CAUSE ANALYSIS\n"
            rca_doc += "-" * 20 + "\n"
            rca_doc += f"{session.resolution.root_cause}\n\n"
        
        # Investigation Timeline
        if session.steps:
            rca_doc += "INVESTIGATION TIMELINE\n"
            rca_doc += "-" * 20 + "\n"
            
            for i, step in enumerate(session.steps, 1):
                rca_doc += f"Step {i}:\n"
                
                if step.command:
                    rca_doc += f"  Command/Action: {step.command}\n"
                
                if step.output:
                    # Truncate very long outputs for readability
                    output = step.output
                    if len(output) > 500:
                        output = output[:500] + "... [TRUNCATED]"
                    rca_doc += f"  Output/Result: {output}\n"
                
                if step.analysis:
                    rca_doc += f"  Analysis: {step.analysis}\n"
                
                rca_doc += "\n"
        
        # Solution Implementation
        if session.resolution.solution:
            rca_doc += "SOLUTION IMPLEMENTATION\n"
            rca_doc += "-" * 25 + "\n"
            rca_doc += f"{session.resolution.solution}\n\n"
        
        # Fix Commands
        if session.resolution.fix_commands:
            rca_doc += "RESOLUTION COMMANDS\n"
            rca_doc += "-" * 20 + "\n"
            rca_doc += f"{session.resolution.fix_commands}\n\n"
        
        # Verification
        if session.resolution.verification:
            rca_doc += "VERIFICATION & TESTING\n"
            rca_doc += "-" * 25 + "\n"
            rca_doc += f"{session.resolution.verification}\n\n"
        
        # Prevention Measures
        if session.resolution.prevention:
            rca_doc += "PREVENTION MEASURES\n"
            rca_doc += "-" * 20 + "\n"
            rca_doc += f"{session.resolution.prevention}\n\n"
        
        # Footer
        rca_doc += "=" * 80 + "\n"
        rca_doc += "End of RCA Report\n"
        rca_doc += f"Generated by ResolvIQ on {timestamp}\n"
        rca_doc += "=" * 80 + "\n"
        
        return rca_doc