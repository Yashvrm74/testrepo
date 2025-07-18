import { useState, useEffect } from 'react';
import { Clock, Star, Download, Award, Users, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const CourseHeader = ({ courseId, title, description, courseProgress }: { courseId: string; title: string; description: string; courseProgress: number }) => {
  const [course, setCourse] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get(`https://seminarroom.tech/api/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error('Error fetching course', err));
  }, [courseId]);

  const handleCertificateDownload = () => {
    if (courseProgress >= 100) {
      toast({
        title: "Certificate Downloaded",
        description: "Your course certificate has been downloaded."
      });
    } else {
      toast({
        title: "Cannot Download Certificate",
        description: "Complete all modules to unlock your certificate.",
        variant: "destructive"
      });
    }
  };

  const upcomingDeadlines = [
    { date: new Date(2025, 3, 10), title: 'Assignment 1 Due', type: 'Assignment' },
    { date: new Date(2025, 3, 15), title: 'Quiz 1', type: 'Quiz' },
    { date: new Date(2025, 3, 22), title: 'Project Submission', type: 'Project' },
  ];

  const leaderboardData = [
    { id: 1, name: 'Emma Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', grade: 'A+', completionRate: 98 },
    { id: 2, name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', grade: 'A', completionRate: 95 },
    { id: 3, name: 'Sophia Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', grade: 'A-', completionRate: 92 },
  ];

  if (!course) return <div>Loading...</div>;

  return (
    <div className="pt-16 bg-white text-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
            <p className="text-gray-600 mb-4">{description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1.5" />
                <span className="font-medium">{course.rating || '4.5'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-1.5" />
                <span>{course.duration || '8 hrs'}</span>
              </div>
              <Badge variant="outline" className="font-normal bg-purple-50 text-purple-700 border-purple-100">
                {course.level || 'Beginner'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border-2 border-purple-100">
                <AvatarImage src={course.instructorAvatar || ''} />
                <AvatarFallback>{course.instructor?.[0] || 'I'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">{course.instructor || 'Instructor Name'}</div>
              </div>
            </div>

            {/* Upcoming Deadlines Section */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-medium mb-3 text-gray-800">Upcoming Deadlines</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {upcomingDeadlines.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border border-purple-100 bg-purple-50 shadow-sm flex flex-col gap-2">
                    <div className="text-sm text-purple-700 font-semibold">
                      {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-md font-medium text-gray-800">{item.title}</div>
                    <Badge variant="outline" className="w-fit text-purple-700 border-purple-200 capitalize">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Progress */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-gray-800">Course Progress</h2>
                <span className="font-medium text-purple-700">{Math.round(courseProgress)}%</span>
              </div>
              <Progress value={courseProgress} className="h-2.5 bg-purple-100" />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleCertificateDownload}
                  disabled={courseProgress < 100}
                  className={`flex items-center gap-2 ${
                    courseProgress >= 100 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 hover:bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-sm bg-white border-gray-200">
              <div className="aspect-video w-full">
                <img src={course.imgSrc || '/placeholder.jpg'} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Total hours</span>
                  <span className="font-medium">{course.hours || '8'}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Lectures</span>
                  <span className="font-medium">{course.lectures || '12'}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Exercises</span>
                  <span className="font-medium">{course.exercises || '5'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="mt-6 border-t pt-4">
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    Course Leaderboard
                  </h3>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Top Students
                  </Badge>
                </div>

                <div className="space-y-3">
                  {leaderboardData.map((student, index) => (
                    <div key={student.id} className={`flex items-center justify-between p-2.5 rounded-lg ${
                      index === 0 ? 'bg-yellow-50 border border-yellow-100' :
                      index === 1 ? 'bg-gray-50 border border-gray-200' :
                      'bg-amber-50 border border-amber-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-xs ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-amber-600'
                        }`}>
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800">{student.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-bold text-sm ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          'text-amber-700'
                        }`}>
                          Grade: {student.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
