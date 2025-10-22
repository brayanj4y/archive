import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Home, Activity, Stethoscope } from "lucide-react"

export default function TheBulldogPage() {
  return (
    <main className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">The French Bulldog</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Learn about the wonderful French Bulldog breed - their history, temperament, care needs, and what makes them
          such beloved companions.
        </p>

        <div className="mb-12">
          <img
            src="/the-bulldog.JPG?height=400&width=800"
            alt="French Bulldog"
            className="w-full h-64 object-cover border border-border mb-6"
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Breed History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              French Bulldogs originated in England in the 1800s as miniature versions of English Bulldogs. When lace
              workers migrated to France during the Industrial Revolution, they brought these small bulldogs with them.
              The breed became extremely popular in France, where they were refined and developed their distinctive bat
              ears.
            </p>
            <p>
              Today, French Bulldogs are one of the most popular breeds in the United States and around the world,
              beloved for their affectionate nature and adaptability to various living situations.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Temperament and Personality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">French Bulldogs are known for their wonderful personalities:</p>
            <ul className="space-y-2">
              <li>
                <h3 className="font-bold mb-1">Affectionate and Loving</h3>
                <p className="text-sm text-muted-foreground">
                  Frenchies form strong bonds with their families and love to cuddle and be close to their people.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Playful and Fun</h3>
                <p className="text-sm text-muted-foreground">
                  Despite their calm demeanor, they enjoy playtime and have a great sense of humor.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Alert and Watchful</h3>
                <p className="text-sm text-muted-foreground">
                  They make excellent watchdogs, alerting you to visitors without excessive barking.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Patient and Gentle</h3>
                <p className="text-sm text-muted-foreground">
                  Great with children and other pets when properly socialized.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Adaptable</h3>
                <p className="text-sm text-muted-foreground">
                  They do well in apartments or houses, making them perfect for various living situations.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Ideal Home Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">French Bulldogs thrive in homes that provide:</p>
            <ul className="space-y-2 text-sm">
              <li>• Climate-controlled environment (they're sensitive to heat and cold)</li>
              <li>• Companionship - they don't like being alone for long periods</li>
              <li>• Moderate activity level - short walks and play sessions</li>
              <li>• Safe, comfortable sleeping area</li>
              <li>• Access to fresh water at all times</li>
              <li>• Regular interaction and mental stimulation</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Exercise and Activity Needs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">French Bulldogs have moderate exercise needs. They enjoy:</p>
            <ul className="space-y-2 text-sm">
              <li>• Short walks (15-30 minutes) once or twice daily</li>
              <li>• Indoor play sessions</li>
              <li>• Mental stimulation through puzzle toys</li>
              <li>• Socialization with other dogs (supervised)</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Important:</strong> Avoid strenuous exercise, especially in hot weather. French Bulldogs can
              overheat quickly due to their flat faces.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Health Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Like all breeds, French Bulldogs have some health considerations to be aware of:</p>
            <ul className="space-y-3">
              <li>
                <h3 className="font-bold mb-1">Brachycephalic Syndrome</h3>
                <p className="text-sm text-muted-foreground">
                  Their flat faces can cause breathing difficulties. Avoid overexertion and heat exposure.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Skin Fold Care</h3>
                <p className="text-sm text-muted-foreground">
                  Regular cleaning of facial wrinkles prevents infections.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Hip Dysplasia</h3>
                <p className="text-sm text-muted-foreground">
                  Quality breeding helps minimize this risk. Maintain healthy weight.
                </p>
              </li>
              <li>
                <h3 className="font-bold mb-1">Allergies</h3>
                <p className="text-sm text-muted-foreground">
                  Some Frenchies may develop food or environmental allergies.
                </p>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              Regular veterinary check-ups and preventative care are essential for keeping your French Bulldog healthy
              and happy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grooming and Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Weekly brushing to remove loose hair</li>
              <li>• Daily cleaning of facial wrinkles</li>
              <li>• Regular nail trimming</li>
              <li>• Ear cleaning as needed</li>
              <li>• Occasional baths (not too frequent)</li>
              <li>• Dental care - brush teeth regularly</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              French Bulldogs are relatively low-maintenance in terms of grooming, making them great for busy families.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
