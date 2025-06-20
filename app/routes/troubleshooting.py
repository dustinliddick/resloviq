from flask import Blueprint, render_template, request, session, jsonify, redirect, url_for
from app.services.troubleshooting_service import TroubleshootingService

troubleshooting_bp = Blueprint('troubleshooting', __name__)
service = TroubleshootingService()

@troubleshooting_bp.route('/')
def index():
    session_id = session.get('session_id')
    if not session_id:
        ts_session = service.create_session()
        session['session_id'] = ts_session.session_id
        session_id = ts_session.session_id
    
    ts_session = service.get_session(session_id)
    if not ts_session:
        ts_session = service.create_session()
        session['session_id'] = ts_session.session_id
    
    return render_template('index.html', session_data=ts_session)

@troubleshooting_bp.route('/update_issue', methods=['POST'])
def update_issue():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    issue_data = {
        'title': request.form.get('title', ''),
        'server': request.form.get('server', ''),
        'symptoms': request.form.get('symptoms', ''),
        'priority': request.form.get('priority', 'Medium')
    }
    
    success = service.update_issue_info(session_id, issue_data)
    return jsonify({'success': success})

@troubleshooting_bp.route('/add_step', methods=['POST'])
def add_step():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    command = request.form.get('command', '')
    output = request.form.get('output', '')
    analysis = request.form.get('analysis', '')
    
    step = service.add_step(session_id, command, output, analysis)
    if step:
        return jsonify({'success': True, 'step': step.to_dict()})
    else:
        return jsonify({'success': False, 'error': 'Command or output required'})

@troubleshooting_bp.route('/remove_step/<int:step_id>', methods=['POST'])
def remove_step(step_id):
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    success = service.remove_step(session_id, step_id)
    return jsonify({'success': success})

@troubleshooting_bp.route('/update_resolution', methods=['POST'])
def update_resolution():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    resolution_data = {
        'root_cause': request.form.get('root_cause', ''),
        'solution': request.form.get('solution', ''),
        'fix_commands': request.form.get('fix_commands', ''),
        'verification': request.form.get('verification', ''),
        'prevention': request.form.get('prevention', '')
    }
    
    success = service.update_resolution(session_id, resolution_data)
    return jsonify({'success': success})

@troubleshooting_bp.route('/generate_report')
def generate_report():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    report = service.generate_report(session_id)
    if report:
        ts_session = service.get_session(session_id)
        return render_template('report.html', report=report, session_data=ts_session)
    else:
        return jsonify({'success': False, 'error': 'Failed to generate report'})

@troubleshooting_bp.route('/reset_session', methods=['POST'])
def reset_session():
    session_id = session.get('session_id')
    if session_id:
        service.reset_session(session_id)
        session.pop('session_id', None)
    
    return redirect(url_for('troubleshooting.index'))

@troubleshooting_bp.route('/api/session_data')
def get_session_data():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    ts_session = service.get_session(session_id)
    if ts_session:
        return jsonify({'success': True, 'data': ts_session.to_dict()})
    else:
        return jsonify({'success': False, 'error': 'Session not found'})

@troubleshooting_bp.route('/complete_rca', methods=['POST'])
def complete_rca():
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({'success': False, 'error': 'No session found'})
    
    # Generate RCA report and create downloadable file
    rca_report = service.generate_rca_report(session_id)
    if rca_report:
        return jsonify({
            'success': True, 
            'message': 'RCA completed successfully',
            'download_url': url_for('troubleshooting.download_rca', session_id=session_id)
        })
    else:
        return jsonify({'success': False, 'error': 'Failed to generate RCA report'})

@troubleshooting_bp.route('/download_rca/<session_id>')
def download_rca(session_id):
    from flask import send_file, make_response
    import io
    import json
    from datetime import datetime
    
    ts_session = service.get_session(session_id)
    if not ts_session:
        return jsonify({'success': False, 'error': 'Session not found'})
    
    # Generate RCA document content
    rca_content = service.generate_rca_document(session_id)
    if not rca_content:
        return jsonify({'success': False, 'error': 'Failed to generate RCA document'})
    
    # Create downloadable file
    output = io.StringIO()
    output.write(rca_content)
    output.seek(0)
    
    # Create response
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/plain'
    response.headers['Content-Disposition'] = f'attachment; filename="RCA_{ts_session.issue_info.title.replace(" ", "_") or "Report"}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt"'
    
    return response