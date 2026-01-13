import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  cn,
} from "@mf-hub/ui";
import "./index.css";

interface SelectedDay {
  date: Date;
  dayName: string;
  horoscope: string;
}

const HOROSCOPE_MESSAGES = [
  "Today brings new opportunities for growth and self-discovery.",
  "Your creativity will shine brightly and inspire those around you.",
  "A moment of clarity will help you make an important decision.",
  "Unexpected connections may lead to meaningful relationships.",
  "Your perseverance will pay off in ways you hadn't imagined.",
  "Trust your intuition - it's guiding you toward the right path.",
  "A small act of kindness will create ripples of positive change.",
  "Your natural leadership qualities will be recognized today.",
  "Focus on balance - harmony between work and personal life awaits.",
  "An old dream may resurface with new possibilities attached.",
  "Your patience will be rewarded with something truly worthwhile.",
  "Communication flows easily - express yourself with confidence.",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const randomHoroscope =
      HOROSCOPE_MESSAGES[
        Math.floor(Math.random() * HOROSCOPE_MESSAGES.length)
      ] ?? "";

    setSelectedDay({
      date: selectedDate,
      dayName,
      horoscope: randomHoroscope,
    });
  };

  const renderCalendarDays = () => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      const isSelected =
        selectedDay &&
        selectedDay.date.getDate() === day &&
        selectedDay.date.getMonth() === month &&
        selectedDay.date.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={cn(
            "aspect-square flex items-center justify-center rounded-lg text-sm font-medium",
            "transition-all duration-200 ease-out",
            "hover:bg-accent hover:scale-105 active:scale-95",
            isToday && !isSelected && "bg-primary text-primary-foreground",
            isSelected && "bg-violet-600 text-white shadow-md",
            !isToday && !isSelected && "bg-card border border-border"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8 opacity-0 animate-fade-in">
        <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100">
          🔮 Mystical Calendar
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Discover Your Daily Insights
        </h1>
        <p className="text-muted-foreground mt-2">
          Click on any day to reveal its mystical horoscope
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar Card */}
        <Card
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                ←
              </Button>
              <CardTitle className="text-lg">
                {MONTHS[month]} {year}
              </CardTitle>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
          </CardContent>
        </Card>

        {/* Selected Day Card */}
        <Card
          className="min-h-[350px] opacity-0 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <CardContent className="pt-6 h-full">
            {selectedDay ? (
              <div
                key={selectedDay.date.toISOString()}
                className="flex flex-col items-center text-center h-full opacity-0 animate-scale-in"
              >
                {/* Day Name */}
                <Badge variant="secondary" className="mb-4">
                  ✨ {selectedDay.dayName}
                </Badge>

                {/* Date Display */}
                <div className="mb-6">
                  <div className="text-5xl font-bold text-violet-600 mb-1">
                    {selectedDay.date.getDate()}
                  </div>
                  <div className="text-muted-foreground">
                    {MONTHS[selectedDay.date.getMonth()]}{" "}
                    {selectedDay.date.getFullYear()}
                  </div>
                </div>

                {/* Horoscope Card */}
                <div className="flex-1 w-full">
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
                    <h4 className="text-violet-700 font-semibold mb-3 flex items-center justify-center gap-2">
                      <span>🔮</span>
                      Daily Horoscope
                      <span>🔮</span>
                    </h4>
                    <p className="text-foreground leading-relaxed italic">
                      "{selectedDay.horoscope}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">🗓️</div>
                <p className="text-muted-foreground">
                  Click on any day to reveal its mystical insights!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module Info Card */}
      <Card
        className="mt-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "300ms" }}
      >
        <CardHeader>
          <CardTitle>Module Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Scope" value="calendarApp" />
            <InfoItem label="Module" value="./App" />
            <InfoItem label="Port" value="3002" />
            <InfoItem label="Shared" value="react, react-dom" />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div
        className="text-center py-6 text-sm text-muted-foreground opacity-0 animate-fade-in"
        style={{ animationDelay: "400ms" }}
      >
        <p>
          ✅ Successfully loaded from{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
            http://localhost:3002
          </code>
        </p>
      </div>
    </div>
  );
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <code className="text-sm font-mono">{value}</code>
    </div>
  );
}

export default App;
