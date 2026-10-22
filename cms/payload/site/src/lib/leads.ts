// Leads go to the "Заявки" collection of Payload CMS (cms/src/collections/Leads.ts).
// The CMS must allow this site in SITE_URL (cms/.env), otherwise the browser blocks the request (CORS).
export interface Lead {
  name: string
  phone: string
  message?: string
  plan?: string
}

const CMS_URL = (
  import.meta.env.PUBLIC_CMS_URL || "http://localhost:3000"
).replace(/\/$/, "")

export async function sendLead(lead: Lead): Promise<void> {
  const response = await fetch(`${CMS_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  })
  if (!response.ok) throw new Error(`Lead was not saved: ${response.status}`)
}
