import pool, { query } from '../db.js';

export async function fetchSubmissionAudioByIdAndSro(id, sroId) {
    return (await query("SELECT submissions.audio FROM submissions, users WHERE submissions.id=? AND submissions.user_id=users.id AND users.sro_id=? LIMIT 1", [id, sroId]))[0];
}

export async function fetchSubmissionData(sroId, withAudio = true) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        await conn.query(`CREATE TEMPORARY TABLE export_submissions SELECT submissions.id as submission_id, users.reference_id, ${withAudio ? 'submissions.audio, ' : 'submissions.audio IS NOT NULL as has_audio, '}submissions.outward_postcode, submissions.test_type_id, submissions.created_at, submissions.received_at FROM submissions, users WHERE submissions.user_id=users.id AND users.sro_id=?`, [sroId]);
        const submissions = await conn.query("SELECT * FROM export_submissions");
        const metadata = await conn.query("SELECT submission_metadata.submission_id, submission_metadata.metadata_key, submission_metadata.metadata_value FROM submission_metadata, export_submissions WHERE submission_metadata.submission_id=export_submissions.submission_id");
        await conn.query("DROP TABLE export_submissions");
        await conn.commit();

        return [submissions, metadata];
    } finally {
        if (conn) conn.release();
    }
}
