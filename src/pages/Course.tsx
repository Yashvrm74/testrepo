import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CourseHeader from '@/components/course/CourseHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar, Clock, Bookmark, CheckCircle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

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
              // Calculate progress based on array lengths
            const readingDone = res.data.readingMaterial ? 1 : 0;
const readingTotal = 1;

const videoDone = res.data.video ? 1 : 0;
const videoTotal = 1;

const assignmentDone = res.data.assignment ? 1 : 0;
const assignmentTotal = 1;

const quizDone = res.data.quiz ? 1 : 0;
const quizTotal = 1;


// ✅ Always divide by 4 parts: reading, video, assignment, quiz
const totalParts = 4;

const partProgress = [
  readingTotal > 0 ? readingDone / readingTotal : 1,
  videoTotal > 0 ? videoDone / videoTotal : 1,
  assignmentTotal > 0 ? assignmentDone / assignmentTotal : 1,
  quizTotal > 0 ? quizDone / quizTotal : 1,
];

const progress = Math.round((partProgress.reduce((a, b) => a + b, 0) / totalParts) * 100);

              return {
                ...mod,
                progress,
              };
            } catch (err) {
              return { ...mod, progress: 0 };
            }
          })
        );

        courseData.modules = moduleProgresses;
        // Count fully completed modules
       // Count modules that are unlocked (progress >= 25)
const completedModules = moduleProgresses.filter(m => m.progress === 100).length;
const totalModules = moduleProgresses.length;
const overall = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

setOverallProgress(overall);

        setCourse(courseData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching course data!", error);
        setLoading(false);
      });
  }, [id]);

  const getOverallCourseProgress = (modules: any[]) => {
    if (!modules.length) return 0;
    const total = modules.reduce((acc, mod) => acc + (mod.progress || 0), 0);
    return Math.round(total / modules.length);
  };

  const getProgressStatus = () => {
    if (overallProgress === 0) return "Not Started";
    if (overallProgress < 50) return "In Progress";
    if (overallProgress < 100) return "Almost Complete";
    return "Completed";
  };

  const handleModuleClick = (moduleId: string, locked: boolean) => {
    if (!locked) {
      navigate(`/module/${id}/${moduleId}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>No course data found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100">
      <CourseHeader courseId={id!} title={course.title} description={course.description} courseProgress={overallProgress} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/" className="flex items-center text-sm mb-6 hover:underline text-purple-600 font-medium">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to All Courses
        </Link>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mb-10 border border-purple-100">
          <div className="bg-gradient-to-r from-purple-200/60 to-purple-50/60 px-8 py-7 border-b border-purple-100 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen className="h-6 w-6 mr-2.5 text-purple-600" />
                Course Modules
              </h2>
              <p className="text-gray-600 mt-1.5 ml-8.5">Complete all modules to receive your certificate</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Progress value={overallProgress} className="h-3 w-40 bg-purple-100/60" />
              <Badge className="bg-white/80 text-purple-700 border border-purple-200 shadow-sm font-semibold">
                {getProgressStatus()} ({overallProgress}%)
              </Badge>
            </div>
          </div>

          <div className="p-8 space-y-7">
            {course.modules.map((module, index) => {
              const isCompleted = module.progress === 100;
              const isFirst = index === 0;
              console.log(`Checking module ${index} - Previous module progress:`, course.modules?.[index - 1]?.progress);

              const prevModule = course.modules?.[index - 1];
              const previousCompleted = index === 0 || (prevModule && prevModule.progress === 100);
              const isLocked = !isFirst && !previousCompleted;

              return (
                <div
                  key={module.id}
                  className={`border border-purple-100 rounded-2xl overflow-hidden ${
                    isLocked ? 'bg-gray-100/70 text-gray-400 cursor-not-allowed' : 'bg-white/80 hover:shadow-xl'
                  } shadow-md transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`w-fit ${isLocked ? 'bg-gray-300 border-gray-200 text-gray-500' : 'bg-purple-100 text-purple-700 border-purple-200'} font-medium shadow-sm`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                          ) : isLocked ? (
                            <Lock className="h-3.5 w-3.5 mr-1.5" />
                          ) : (
                            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                          )}
                          Module {index + 1}
                        </Badge>
                        <h3 className={`text-lg font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-800 group-hover:text-purple-700'} transition-colors`}>
                          {module.title}
                        </h3>
                      </div>

                      <Button
                        onClick={() => handleModuleClick(module.id, isLocked)}
                        size="sm"
                        disabled={isLocked}
                        className={`${isLocked ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-purple-600 hover:bg-purple-700 text-white'} shadow-md px-5 py-2 rounded-lg`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-1.5" />
                            Locked
                          </>
                        ) : (
                          'Go to Module Materials'
                        )}
                      </Button>
                    </div>

                    <p className={`text-sm mt-2.5 md:ml-[7.5rem] md:mt-0 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {module.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-purple-100 flex flex-wrap gap-4 items-center">
                      <div className="flex items-center text-xs text-purple-700">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>{module.totalLectures || 4} lectures</span>
                      </div>
                      <div className="flex items-center text-xs text-purple-700">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>Estimated time: {(module.totalLectures || 4) * 25} minutes</span>
                      </div>
                      <div className="flex items-center text-xs text-purple-700">
  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
  <span>{(module.progress || 0).toFixed(1)}% completed</span>

</div>

                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 ml-auto shadow-sm">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
