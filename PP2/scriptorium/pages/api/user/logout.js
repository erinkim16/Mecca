/**
 * Our logout endpoint does not do much because we will make logging out client-side
 */

export default function handler(req, res) {
  if (req.method === "POST") {
    //  with current implementation, no need to do anything in backend
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
