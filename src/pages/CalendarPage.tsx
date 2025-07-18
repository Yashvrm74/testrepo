
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isAfter, isSameDay, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Filter, CalendarClock, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { SessionDetailsDialog } from "@/components/SessionDetailsDialog";
import { CalendarEvent } from "@/types/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const currentDate = new Date();
 const events: CalendarEvent[] = [
    {
      id: "1",
      name: "Introduction to Python",
      date: new Date(2024, 6, 10, 10, 0),
      endDate: new Date(2024, 6, 10, 12, 0),
      type: "course",
      description: "Learn the basics of Python programming. This is a beginner-friendly session covering variables, data types, and basic control structures.",
      instructor: "Dr. Sarah Brown",
      location: "Virtual Classroom 3A",
      tags: ["Programming", "Beginner"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "2",
      name: "Data Science Fundamentals Quiz",
      date: new Date(2024, 6, 15, 14, 0),
      endDate: new Date(2024, 6, 15, 15, 30),
      type: "quiz",
      description: "A quiz to test your understanding of data science fundamentals including statistics, data visualization, and basic machine learning concepts.",
      instructor: "Prof. James Wilson",
      location: "Online",
      tags: ["Data Science", "Assessment"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "3",
      name: "Live Coding Challenge: Algorithms",
      date: new Date(2024, 6, 20, 16, 0),
      endDate: new Date(2024, 6, 20, 18, 0),
      type: "challenge",
      description: "Join us for a live coding challenge focusing on algorithms and data structures. This is a competitive event with prizes for the top performers.",
      instructor: "Alex Chen",
      location: "Virtual Lab 2",
      tags: ["Algorithms", "Competition"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "4",
      name: "Web Development Workshop",
      date: new Date(2024, 6, 12, 13, 0),
      endDate: new Date(2024, 6, 12, 15, 0),
      type: "course",
      description: "A hands-on workshop on modern web development practices using React and Node.js.",
      instructor: "Emily Johnson",
      location: "Virtual Classroom 1B",
      tags: ["Web Development", "React"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "5",
      name: "Database Systems Quiz",
      date: new Date(2024, 6, 18, 11, 0),
      endDate: new Date(2024, 6, 18, 12, 30),
      type: "quiz",
      description: "Test your knowledge of database design, SQL queries, and database management systems.",
      instructor: "Dr. Michael Lee",
      location: "Online",
      tags: ["Databases", "SQL"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "6",
      name: "JavaScript Fundamentals",
      date: addDays(currentDate, 1),
      endDate: addDays(currentDate, 1, 2),
      type: "course",
      description: "Master the basics of JavaScript including variables, functions, and DOM manipulation.",
      instructor: "Mark Wilson",
      location: "Virtual Classroom 2C",
      tags: ["JavaScript", "Web Development"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "7",
      name: "Data Structures Quiz",
      date: addDays(currentDate, 2),
      endDate: addDays(currentDate, 2, 1.5),
      type: "quiz",
      description: "Test your knowledge on arrays, linked lists, trees, and graphs.",
      instructor: "Dr. Lisa Chen",
      location: "Online",
      tags: ["Data Structures", "Algorithms"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "8",
      name: "Mobile App Development",
      date: addDays(currentDate, 3),
      endDate: addDays(currentDate, 3, 2),
      type: "course",
      description: "Learn how to build cross-platform mobile applications using React Native.",
      instructor: "Jason Park",
      location: "Virtual Lab 1",
      tags: ["Mobile", "React Native"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    },
    {
      id: "9",
      name: "Hackathon: AI Solutions",
      date: addDays(currentDate, 5),
      endDate: addDays(currentDate, 5, 8),
      type: "challenge",
      description: "Participate in a day-long hackathon to build AI-powered solutions for real-world problems.",
      instructor: "Dr. Robert Johnson",
      location: "Virtual Collab Space",
      tags: ["AI", "Hackathon", "Competition"],
      imageUrl: "/lovable-uploads/036ce3de-ca69-4830-9b71-ff1fd7d7c0ed.png"
    }
  ];

  function addDays(date: Date, days: number, hours: number = 0): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    if (hours) {
      result.setHours(result.getHours() + hours);
    }
    return result;
  }

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDateDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
    setIsDateDialogOpen(false);
  };

  const upcomingDeadlines = events
    .filter(event => isAfter(event.date, currentDate))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const renderEventIndicators = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length === 0) return null;
    return (
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
        {dayEvents.slice(0, 3).map((event, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full shadow-sm ${
              event.type === 'course' ? 'bg-blue-600' :
              event.type === 'quiz' ? 'bg-yellow-500' :
              'bg-emerald-500'
            }`}
          />
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-muted-foreground">+{dayEvents.length - 3}</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <h1 className="text-3xl font-semibold mb-8 text-center lg:text-left">📅 Your Learning Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between px-6">
            <CardTitle className="text-xl font-semibold">{format(date, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-4 items-center">
              {upcomingDeadlines.length > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Next: {upcomingDeadlines[0].name} - {format(upcomingDeadlines[0].date, 'MMM d, h:mm a')}</span>
                </div>
              )}
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <TooltipProvider>
              <Calendar
                mode="default"
                className="rounded-xl border w-full max-w-none bg-white shadow-sm"
                style={{ minWidth: "100%" }}
                onMonthChange={setDate}
                onDayClick={handleDayClick}
                components={{
                  DayContent: ({ date }) => (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative h-14 w-14 p-2 font-medium aria-selected:opacity-100 flex items-center justify-center hover:bg-muted/70 rounded-lg cursor-pointer">
                          <div>{date.getDate()}</div>
                          {renderEventIndicators(date)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getEventsForDay(date).length > 0
                          ? `${getEventsForDay(date).length} events`
                          : "No events"}
                      </TooltipContent>
                    </Tooltip>
                  )
                }}
              />
            </TooltipProvider>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-md">
          <CardHeader className="px-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {upcomingDeadlines.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/70 shadow-sm"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`h-3 w-3 rounded-full ${
                        event.type === 'course' ? 'bg-blue-600' :
                        event.type === 'quiz' ? 'bg-yellow-500' :
                        'bg-emerald-500'
                      }`} />
                      <p className="font-semibold text-sm truncate max-w-[80%]">{event.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, 'EEEE, MMM d')}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {format(event.date, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <CalendarClock className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center text-sm">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedDate && getEventsForDay(selectedDate).length > 0 ? (
              getEventsForDay(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/70 shadow-sm"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-3 w-3 rounded-full ${
                      event.type === 'course' ? 'bg-blue-600' :
                      event.type === 'quiz' ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`} />
                    <p className="font-semibold text-sm">{event.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CalendarClock className="h-4 w-4" />
                    {format(event.date, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6">No events scheduled for this day</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedEvent && (
        <SessionDetailsDialog
          event={selectedEvent}
          open={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
        />
      )}
    </div>
  );
};

export default CalendarPage;
