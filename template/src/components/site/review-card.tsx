import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  name: string
  role: string
  text: string
}

// Avatar parts share React context, so they are composed here in .tsx:
// in an .astro file every React component renders on its own and the context is lost.
export function ReviewCard({ name, role, text }: Props) {
  return (
    <Card>
      <CardContent className="grid gap-4">
        <p>«{text}»</p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{name}</p>
            <p className="text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
