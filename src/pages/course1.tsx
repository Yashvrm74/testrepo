
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, BookOpen, Calendar, Clock, Bookmark,
  CheckCircle, Star, Award, Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious,
} from '@/components/ui/carousel';

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moduleCountCompleted, setModuleCountCompleted] = useState(0);
  const [totalModules, setTotalModules] = useState(0);

  const leaderboardData = [
    { id: 1, name: 'Emma Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', grade: 'A+' },
    { id: 2, name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', grade: 'A' },
    { id: 3, name: 'Sophia Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', grade: 'A-' },
  ];

  const upcomingDeadlines = [
    { date: new Date(2025, 3, 10), title: 'Assignment 1 Due', type: 'assignment' },
    { date: new Date(2025, 3, 15), title: 'Quiz 1', type: 'quiz' },
    { date: new Date(2025, 3, 22), title: 'Project Submission', type: 'project' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`https://seminarroom.tech/api/courses/${id}`)
      .then(async response => {
        const courseData = response.data;

        const moduleProgresses = await Promise.all(
          courseData.modules.map(async (mod: any) => {
            try {
              const res = await axios.get(`https://seminarroom.tech/api/progress/${user.id}/${mod.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const progress = (
                res.data.readingMaterialCompleted +
                res.data.videoCompleted +
                res.data.assignmentCompleted +
                res.data.quizCompleted
              ) * 25;
              return { ...mod, progress };
            } catch {
              return { ...mod, progress: 0 };
            }
          })
        );

        const completedModules = moduleProgresses.filter(mod => mod.progress === 100).length;
        courseData.modules = moduleProgresses;
        setCourse(courseData);
        setModuleCountCompleted(completedModules);
        setTotalModules(moduleProgresses.length);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching course!", err);
        setLoading(false);
      });
  }, [id]);

  const overallProgress = totalModules === 0 ? 0 : Math.round((moduleCountCompleted / totalModules) * 100);

  const getProgressStatus = () => {
    if (overallProgress === 0) return "Not Started";
    if (overallProgress < 50) return "In Progress";
    if (overallProgress < 100) return "Almost Complete";
    return "Completed";
  };

  const getProgressColor = () => {
    if (overallProgress === 100) return "bg-green-500";
    return "bg-purple-500";
  };

  const handleCertificateDownload = () => {
    if (overallProgress === 100) {
      alert("🎉 Certificate downloaded!");
    } else {
      alert("⚠️ Complete all modules to unlock your certificate.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>No course data found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-1.5" />
              <span className="font-medium">{course.rating || "4.5"}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-1.5" />
              <span>{course.duration || "8 hrs"}</span>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100">
              {course.level || "Beginner"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-purple-100">
              <AvatarImage src={course.instructorAvatar || ""} />
              <AvatarFallback>{course.instructor?.[0] || "I"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{course.instructor || "Instructor Name"}</div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium mb-3 text-gray-800">Upcoming Deadlines</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {upcomingDeadlines.map((deadline, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                        <div className="text-sm font-medium text-purple-800">
                          {deadline.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="font-medium mt-1 text-gray-800">{deadline.title}</div>
                        <Badge variant="outline" className="mt-2 bg-white/80 text-purple-700 border-purple-200">
                          {deadline.type}
                        </Badge>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Progress Section */}
          <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border border-purple-100 bg-purple-50">
              <h2 className="text-lg font-semibold text-purple-700 mb-1 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                Overall Course Progress
              </h2>
              <div className="flex items-center justify-between">
                <Badge className={`text-white ${getProgressColor()}`}>{getProgressStatus()}</Badge>
                <span className="text-sm text-purple-700">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className={`h-2 mt-2 ${getProgressColor()}`} />
            </div>
            <div className="flex justify-end px-6 pb-6">
              <Button
                onClick={handleCertificateDownload}
                disabled={overallProgress < 100}
                className={`flex items-center gap-2 ${
                  overallProgress === 100
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Download Certificate
              </Button>
            </div>
          </div>

          {/* Course Modules - full screen width */}
          <div className="mt-10 bg-white rounded-xl shadow-md overflow-hidden w-[75vw]">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 px-6 py-5 border-b border-purple-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen className="h-6 w-6 mr-2.5 text-purple-600" />
                Course Modules
              </h2>
              <p className="text-gray-600 mt-1.5 ml-8.5">Complete all modules to receive your certificate</p>
            </div>
            <div className="px-10 py-6 space-y-5">
              {course.modules.map((module, index) => {
                const isCompleted = module.progress === 100;
                return (
                  <div
                    key={module.id}
                    className="border border-purple-100 rounded-xl bg-white shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 font-medium">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            ) : (
                              <Bookmark className="h-4 w-4 mr-1" />
                            )}
                            Module {index + 1}
                          </Badge>
                          <h3 className="text-lg font-medium text-gray-800">{module.title}</h3>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/module/${id}/${module.id}`)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Go to Module
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{module.description}</p>
                      <div className="mt-3 pt-3 border-t border-purple-100 flex gap-4 flex-wrap text-xs text-purple-700">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {module.totalLectures || 4} lectures
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Estimated time: {(module.totalLectures || 4) * 25} minutes
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-600" />
                          {module.progress}% completed
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <img
              src={course.imgSrc || "/placeholder.jpg"}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total hours</span>
                <span className="font-medium">{course.hours || 8}</span>
              </div>
              <div className="flex justify-between">
                <span>Lectures</span>
                <span className="font-medium">{course.lectures || 12}</span>
              </div>
              <div className="flex justify-between">
                <span>Exercises</span>
                <span className="font-medium">{course.exercises || 4}</span>
              </div>
            </div>
            <div className="px-4 pt-4 pb-2 border-t">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-semibold text-gray-800 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Course Leaderboard
                </h3>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Top Students
                </Badge>
              </div>
              <div className="space-y-2">
                {leaderboardData.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 text-xs text-white bg-purple-500 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                    <span className="font-semibold text-purple-700">Grade: {student.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-4">
        <Link to="/" className="text-sm text-purple-600 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Courses
        </Link>
      </div>
    </div>
  );
};

export default Course;