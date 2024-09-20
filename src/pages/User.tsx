import { Card, CardHeader, CardContent } from "../components/ui/card";

export default function WeatherDashboard() {
  return (
    <main className="container mx-auto h-screen">
      {/* Upper Info */}
      <div className="flex h-1/2 mt-5 gap-4">
        {/* Weather Overview */}
        <Card className="h-full w-[400px] rounded-lg">
          <CardHeader>
            <div className="flex md:flex-col gap-2">
              <div className="weather-image w-[190px] h-[190px] bg-muted rounded-lg"></div>
              <div className="weather-temp w-[190px] h-[190px] bg-muted rounded-lg"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-b pb-2">
              <h4 className="text-xl font-bold">Cloudy Weather</h4>
            </div>
            <div className="mt-6">
              <h6 className="text-lg">New Delhi, India</h6>
              <p className="text-sm">14 Sept 2024, 14:22</p>
            </div>
          </CardContent>
        </Card>

        {/* Weather Info */}
        <Card className="flex-1 h-full rounded-lg">
          <CardHeader>
            <h4 className="text-xl font-bold">Weather Details</h4>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {["Info 1", "Info 2", "Info 3"].map((info, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="info-image w-16 h-16 bg-muted rounded-lg"></div>
                  <h6 className="text-lg">{info}</h6>
                </div>
              ))}
            </div>

            {/* Lower Weather Info */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {["Detail 1", "Detail 2", "Detail 3"].map((info, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="info-image-l w-16 h-16 bg-muted rounded-lg"></div>
                  <h6 className="text-lg">{info}</h6>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Info */}
      <div className="flex h-1/2 mt-4 gap-4">
        {/* Weather Forecast */}
        <Card className="w-[520px] h-full rounded-lg">
          <CardHeader>
            <h4 className="text-xl font-bold ml-3 mt-2">Forecast Title</h4>
          </CardHeader>
          <CardContent>
            <ul className="mt-5 space-y-4">
              {[
                { date: "15 Sept", day: "Sunday" },
                { date: "16 Sept", day: "Monday" },
                { date: "17 Sept", day: "Tuesday" },
                { date: "18 Sept", day: "Wednesday" },
                { date: "19 Sept", day: "Thursday" },
              ].map((forecast, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="forecast-weather-image w-10 h-10 bg-muted rounded-lg"></div>
                  <span className="text-lg">{forecast.date}</span>
                  <span className="text-sm">{forecast.day}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weather Analysis */}
        <Card className="flex-1 h-full rounded-lg">
          <CardContent>
            <h4 className="text-xl font-bold">Weather Analysis</h4>
            {/* Add more content here if needed */}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
