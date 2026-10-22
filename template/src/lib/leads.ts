// Where the order form goes. Without a backend the lead is only logged in the browser console.
// Connect your service here (your API, a form service, a Telegram bot via your server…),
// or create the project with --cms=payload: leads are then saved in Payload.
export interface Lead {
  name: string
  phone: string
  message?: string
  plan?: string
}

export async function sendLead(lead: Lead): Promise<void> {
  console.info("[leads] no backend connected, lead:", lead)
}
