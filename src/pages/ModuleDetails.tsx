
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import QuizAttempt from './QuizAttempt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListOrdered, CheckCircle, Clock } from 'lucide-react';
import { HelpCircle, Calendar as CalendarIcon } from 'lucide-react';
import QuizReview from './QuizReview';

const PROGRESS_VALUES = {
  readingMaterial: 25,
  video: 25,
  assignment: 25,
  quiz: 25,
};

const ModuleDetails = () => {
  const [currentModule, setCurrentModule] = useState<{ title: string } | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false); // ✅ NEW
const [viewResult, setViewResult] = useState(false);

  const [progress, setProgress] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || '';
  const userId = user?.id;
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('reading-materials');
  const [module, setModule] = useState<any>(null);

  const [completed, setCompleted] = useState({
    readingMaterial: [] as number[],
    video: [] as number[],
    assignment: [] as number[],
    quiz: false,
  });

  const [readingMaterials, setReadingMaterials] = useState<any[]>([]);
  const [videoLinks, setVideoLinks] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (!userId || !moduleId) return;
    axios.get(`https://seminarroom.tech/api/progress/${userId}/${moduleId}`)
      .then((res) => {
        setCompleted({
          readingMaterial: res.data.readingMaterial ? [1] : [],
          video: res.data.video ? [1] : [],
          assignment: res.data.assignment ? [1] : [],
          quiz: !!res.data.quiz,
        });
        setQuizCompleted(!!res.data.quiz); // ✅ Track quiz completion
      }).catch((err) => console.error('Error fetching progress:', err));
  }, [userId, moduleId]);

  const saveProgress = useCallback(() => {
    if (!userId || !moduleId) return;
    const payload = {
      userId,
      moduleId,
      readingMaterial: completed.readingMaterial.length > 0,
      video: completed.video.length > 0,
      assignment: completed.assignment.length > 0,
      quiz: completed.quiz,
    };
    axios.post(`https://seminarroom.tech/api/progress`, payload)
      .then(() => console.log('Progress saved successfully'))
      .catch((err) => console.error('Error saving progress:', err));
  }, [userId, moduleId, completed]);

  useEffect(() => {
    const hasProgress =
      completed.readingMaterial.length ||
      completed.video.length ||
      completed.assignment.length ||
      completed.quiz;
    if (hasProgress) saveProgress();
  }, [completed]);

  useEffect(() => {
    if (!courseId || !moduleId) return;
    axios.get(`https://seminarroom.tech/api/courses/${courseId}/modules/${moduleId}`)
      .then((res) => setModule(res.data));
    axios.get(`https://seminarroom.tech/api/modules/${moduleId}/reading-materials`)
      .then((res) => setReadingMaterials(res.data));
    axios.get(`https://seminarroom.tech/api/modules/${moduleId}/video-lectures`)
      .then((res) => setVideoLinks(res.data));
    axios.get(`https://seminarroom.tech/api/courses/${courseId}/modules/${moduleId}/assignments`)
      .then((res) => setAssignments(res.data));
  }, [courseId, moduleId]);

  // Modified Progress Calculation
  useEffect(() => {
    const readingProgress = readingMaterials.length > 0 && completed.readingMaterial.length
      ? 25
      : 0;
    const videoProgress = completed.video.length > 0 ? 25 : 0;
    const assignmentProgress = assignments.length > 0 && completed.assignment.length
      ? 25
      : 0;
    const quizProgress = completed.quiz ? 25 : 0;

    setProgress(readingProgress + videoProgress + assignmentProgress + quizProgress);
  }, [completed, readingMaterials.length, videoLinks.length, assignments.length]);

  const getProgressStatus = () => {
    if (progress === 0) return 'Not Started';
    if (progress < 50) return 'In Progress';
    if (progress < 100) return 'Almost Complete';
    return 'Completed';
  };

  // const handleDownload = async (materialId: number) => {
  //   const res = await axios.get(
  //     `http://localhost:8080/api/courses/${courseId}/modules/${moduleId}/reading-materials/${materialId}/download`,
  //     { responseType: 'blob' }
  //   );
  //   const blob = new Blob([res.data], { type: 'application/pdf' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `material_${materialId}.pdf`;
  //   link.click();
  //   setCompleted((prev) => ({
  //     ...prev,
  //     readingMaterial: [...new Set([...prev.readingMaterial, materialId])],
  //   }));
  // };
  const handleViewPdf = (s3Url: string) => {
      // setCompleted((prev) => ({ ...prev, material: true }));
      setCompleted((prev) => ({
  ...prev,
  readingMaterial: [...new Set([...prev.readingMaterial, 1])],
}));

      window.open(s3Url, '_blank');
  };

  const handleWatchVideo = (videoUrl: string, videoId: number) => {
    setCompleted((prev) => ({
      ...prev,
      video: [...new Set([...prev.video, videoId])],
    }));
    window.open(videoUrl, '_blank');
  };

  const handleStartQuiz = () => {
  
    setShowForm(true);
  };

  const handleStartAssignment = (assignmentId: number) => {
    navigate(`/assignment/${courseId}/${moduleId}/${assignmentId}`);
  };

  if (!module) return <div className="text-center p-10">Module not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-20 bg-purple-700 text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-4">
            <Badge variant="outline" className="mr-3 bg-white/10 text-white border-white/20">
              <ListOrdered className="h-3.5 w-3.5 mr-1" />
              Module
            </Badge>
            <h1 className="text-2xl font-bold">{module.title}</h1>
            <p className="text-white/80 mt-1">{module.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Card className="mb-6 bg-white border-purple-100 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mr-2">Module Progress:</h3>
                <Badge className="bg-purple-600 text-white">{getProgressStatus()}</Badge>
              </div>
              <div className="flex items-center">
                {progress === 100 && (
                  <div className="flex items-center text-green-500 mr-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                )}
                <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
              </div>
            </div>
            <Progress value={progress} className="h-2 mt-2 bg-purple-500" />
          </CardContent>
        </Card>

        <Tabs defaultValue="reading-materials" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 bg-purple-100 text-purple-800">
            <TabsTrigger value="reading-materials">Reading Materials</TabsTrigger>
            <TabsTrigger value="videos">Video Lectures</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="reading-materials">
            <h2 className="text-xl font-semibold mb-4">Reading Materials</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {readingMaterials.map((m) => (
                <Card key={m.id}>
                  <CardHeader className="pb-2 flex justify-between">
                    <CardTitle className="text-lg">{m.title}</CardTitle>
                    <Badge>PDF</Badge>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleViewPdf(m.s3Url)} className="w-full bg-purple-600 text-white">
                      View Pdf
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <h2 className="text-xl font-semibold mb-4">Video Lectures</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {videoLinks.map((v) => (
                <Card key={v.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> {v.duration || 'N/A'}
                    </div>
                    <Button onClick={() => handleWatchVideo(v.youtubeLink, v.id)} className="w-full bg-purple-600 text-white">
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <h2 className="text-xl font-semibold mb-4">Assignments</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {assignments.map((a) => (
                <Card key={a.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{a.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleStartAssignment(a.id)} className="w-full bg-purple-600 text-white">
                      Start Assignment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        <TabsContent value="quiz">
  <h2 className="text-xl font-semibold mb-4">Quiz</h2>

  {completed.quiz ? (
    viewResult ? (
      <QuizReview />
    ) : (
      <Button onClick={() => setViewResult(true)} className="bg-purple-600 text-white">
        View Result
      </Button>
    )
  ) : showForm ? (
    <QuizAttempt moduleId={moduleId!} />
  ) : (
    <Button onClick={handleStartQuiz} className="bg-purple-600 text-white">
      Start Quiz
    </Button>
  )}
</TabsContent>


        </Tabs>
      </div>
    </div>
  );
};

export default ModuleDetails;
