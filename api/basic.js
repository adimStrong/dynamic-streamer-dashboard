export default function handler(req, res) {
    res.json({ status: 'working', time: new Date().toISOString() });
}