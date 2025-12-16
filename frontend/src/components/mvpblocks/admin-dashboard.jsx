"use client";
import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Users, Activity, DollarSign, Eye, BookOpen, FileText, Zap, TrendingUp, Shield, Database } from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { RevenueChart } from "@/components/ui/revenue-chart";
import { UsersTable } from "@/components/ui/users-table";
import { QuickActions } from "@/components/ui/quick-actions";
import { SystemStatus } from "@/components/ui/system-status";
import { RecentActivity } from "@/components/ui/recent-activity";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_ROOT_URL = ((import.meta.env.VITE_BACKEND_URL) || "http://localhost:8000") + "/api";
const API_BASE_URL = API_ROOT_URL + "/v1";

export default function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionPage, setQuestionPage] = useState(1);
  const [questionPerPage, setQuestionPerPage] = useState(50);
  const [questionPagination, setQuestionPagination] = useState({ total:0, last_page:1 });
  const [questionCategory, setQuestionCategory] = useState("");
  const [questionLicense, setQuestionLicense] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({ id:null, name:"", license_type_id:null, description:"", duration:"", price:0, discount_price:0, is_active:true });
  const [trafficSigns, setTrafficSigns] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [examStats, setExamStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [statusItems, setStatusItems] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);
  const [apiLatency, setApiLatency] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Admin CRUD states
  const [categories, setCategories] = useState([]);
  const [licenseTypes, setLicenseTypes] = useState([]);

  // Materials modal state
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({ id:null, title:"", content:"", material_type:"tip", image_url:"", sort_order:0, is_published:true });

  // Questions modal state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({ id:null, question_text:"", image_url:"", license_type_id:null, category_id:null, is_liability_question:false, explanation:"", is_active:true, answers:[{answer_text:"", is_correct:false},{answer_text:"", is_correct:false}] });

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/registrations?per_page=5`);
      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts?per_page=5`);
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      params.set('per_page', String(questionPerPage));
      params.set('page', String(questionPage));
      if (questionSearch?.trim()) params.set('search', questionSearch.trim());
      if (questionCategory) params.set('category', String(questionCategory));
      if (questionLicense) params.set('license', String(questionLicense));
      const response = await fetch(`${API_BASE_URL}/admin/questions?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data || []);
        if (data.pagination) setQuestionPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses?per_page=10`);
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // CRUD: Courses
  const openCreateCourse = () => {
    setCourseForm({ id:null, name:"", license_type_id:null, description:"", duration:"", price:0, discount_price:0, is_active:true });
    setCourseModalOpen(true);
  };
  const openEditCourse = (c) => {
    setCourseForm({
      id: c.id,
      name: c.name || "",
      license_type_id: c.license_type_id || null,
      description: c.description || "",
      duration: c.duration || "",
      price: Number(c.price || 0),
      discount_price: Number(c.discount_price || 0),
      is_active: !!c.is_active,
    });
    setCourseModalOpen(true);
  };
  const saveCourse = async () => {
    try {
      const method = courseForm.id ? 'PUT' : 'POST';
      const url = courseForm.id ? `${API_BASE_URL}/admin/courses/${courseForm.id}` : `${API_BASE_URL}/admin/courses`;
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(courseForm)});
      const data = await res.json();
      if (data.success) {
        setCourseModalOpen(false);
        await fetchCourses();
      } else { alert(data.message || 'Lưu thất bại'); }
    } catch (e) { console.error('saveCourse', e); alert('Lỗi lưu'); }
  };
  const deleteCourse = async (id) => {
    if (!confirm('Xóa khóa học này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/courses/${id}`, { method:'DELETE' });
      const data = await res.json();
      if (data.success) await fetchCourses();
    } catch (e) { console.error('deleteCourse', e); }
  };

  // Fetch traffic signs
  const fetchTrafficSigns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/traffic-signs?per_page=10`);
      const data = await response.json();
      if (data.success) {
        setTrafficSigns(data.data);
      }
    } catch (error) {
      console.error("Error fetching traffic signs:", error);
    }
  };

  // Fetch study materials
  const fetchStudyMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/study-materials?per_page=10`);
      const data = await response.json();
      if (data.success) {
        setStudyMaterials(data.data);
      }
    } catch (error) {
      console.error("Error fetching study materials:", error);
    }
  };

  // Fetch exam statistics
  const fetchExamStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/exam-stats`);
      const data = await response.json();
      if (data.success) {
        setExamStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching exam stats:", error);
    }
  };

  // Fetch admin users
  const fetchAdminUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users?per_page=8`);
      const data = await response.json();
      if (data.success) {
        setAdminUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/activity-logs?per_page=8`);
      const data = await response.json();
      if (data.success) {
        setActivityLogs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  // Fetch categories and license types for forms
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      if (data && data.data) setCategories(data.data);
    } catch (e) { console.error('fetchCategories', e); }
  };
  const fetchLicenseTypes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/license-types`);
      const data = await res.json();
      if (data && data.data) setLicenseTypes(data.data);
    } catch (e) { console.error('fetchLicenseTypes', e); }
  };

  // CRUD: Study Materials
  const openCreateMaterial = () => {
    setMaterialForm({ id:null, title:"", content:"", material_type:"tip", image_url:"", sort_order:0, is_published:true });
    setMaterialModalOpen(true);
  };
  const openEditMaterial = (m) => {
    setMaterialForm({
      id: m.id, title: m.title || "", content: m.content || "", material_type: m.material_type || 'tip', image_url: m.image_url || '', sort_order: m.sort_order || 0, is_published: !!m.is_published
    });
    setMaterialModalOpen(true);
  };
  const saveMaterial = async () => {
    try {
      const method = materialForm.id ? 'PUT' : 'POST';
      const url = materialForm.id ? `${API_BASE_URL}/admin/study-materials/${materialForm.id}` : `${API_BASE_URL}/admin/study-materials`;
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(materialForm)});
      const data = await res.json();
      if (data.success) {
        setMaterialModalOpen(false);
        await fetchStudyMaterials();
      } else {
        alert(data.message || 'Lưu thất bại');
      }
    } catch (e) { console.error('saveMaterial', e); alert('Lỗi lưu'); }
  };
  const deleteMaterial = async (id) => {
    if (!confirm('Xóa tài liệu này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/study-materials/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchStudyMaterials();
    } catch (e) { console.error('deleteMaterial', e); }
  };

  // CRUD: Questions
  const openCreateQuestion = () => {
    setQuestionForm({ id:null, question_text:"", image_url:"", license_type_id:null, category_id:null, is_liability_question:false, explanation:"", is_active:true, answers:[{answer_text:"", is_correct:false},{answer_text:"", is_correct:false}] });
    setQuestionModalOpen(true);
  };
  const openEditQuestion = async (q) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/questions/${q.id}`);
      const data = await res.json();
      if (data.success) {
        const ans = (data.data?.answers || []).map(a=>({answer_text:a.answer_text, is_correct: !!a.is_correct}));
        setQuestionForm({
          id: q.id,
          question_text: data.data.question.question_text,
          image_url: data.data.question.image_url,
          license_type_id: data.data.question.license_type_id,
          category_id: data.data.question.category_id,
          is_liability_question: !!data.data.question.is_liability_question,
          explanation: data.data.question.explanation || "",
          is_active: !!data.data.question.is_active,
          answers: ans.length? ans : [{answer_text:"", is_correct:false}]
        });
        setQuestionModalOpen(true);
      }
    } catch (e) { console.error('openEditQuestion', e); }
  };
  const addAnswer = () => setQuestionForm(prev=>({ ...prev, answers:[...prev.answers, {answer_text:"", is_correct:false}] }));
  const removeAnswer = (idx) => setQuestionForm(prev=>({ ...prev, answers: prev.answers.filter((_,i)=>i!==idx) }));
  const updateAnswer = (idx, patch) => setQuestionForm(prev=>({ ...prev, answers: prev.answers.map((a,i)=> i===idx? { ...a, ...patch } : a ) }));
  const saveQuestion = async () => {
    if (!questionForm.question_text?.trim()) { alert('Nhập nội dung câu hỏi'); return; }
    if (!questionForm.answers?.length) { alert('Thêm ít nhất 1 đáp án'); return; }
    try {
      const method = questionForm.id ? 'PUT' : 'POST';
      const url = questionForm.id ? `${API_BASE_URL}/admin/questions/${questionForm.id}` : `${API_BASE_URL}/admin/questions`;
      const payload = { ...questionForm };
      const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setQuestionModalOpen(false);
        await fetchQuestions();
      } else {
        alert(data.message || 'Lưu thất bại');
      }
    } catch (e) { console.error('saveQuestion', e); alert('Lỗi lưu'); }
  };
  const deleteQuestion = async (id) => {
    if (!confirm('Xóa câu hỏi này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/questions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchQuestions();
    } catch (e) { console.error('deleteQuestion', e); }
  };

  // Ping API and build system status items
  const fetchSystemHealth = async () => {
    const started = performance.now();
    let online = false;
    try {
      const res = await fetch(`${API_ROOT_URL}/ping`);
      const json = await res.json();
      online = !!json.ok;
    } catch (e) {
      online = false;
    }
    const latency = Math.round(performance.now() - started);
    setServerOnline(online);
    setApiLatency(latency);
    const items = [
      {
        label: "API", status: online ? `${latency} ms` : "Offline", color: online ? "text-green-500" : "text-red-500", icon: Shield, percentage: online ? Math.max(10, 100 - Math.min(90, Math.floor(latency / 5))) : 0,
      },
      {
        label: "Database", status: stats ? "Healthy" : "Checking", color: stats ? "text-green-500" : "text-yellow-500", icon: Database, percentage: stats ? 95 : 50,
      },
    ];
    setStatusItems(items);
  };

  // Initial load
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchRegistrations(),
        fetchContacts(),
        fetchQuestions(),
        fetchCourses(),
        fetchTrafficSigns(),
        fetchStudyMaterials(),
        fetchExamStats(),
        fetchAdminUsers(),
        fetchActivityLogs(),
        fetchCategories(),
        fetchLicenseTypes(),
      ]);
      await fetchSystemHealth();
      setLoading(false);
    };

    loadAllData();
  }, []);

  // Auto refetch questions when paging/filter changes
  useEffect(() => {
    fetchQuestions();
  }, [questionPage, questionPerPage, questionCategory, questionLicense]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchDashboardStats(),
      fetchRegistrations(),
      fetchContacts(),
      fetchQuestions(),
      fetchCourses(),
      fetchTrafficSigns(),
      fetchStudyMaterials(),
      fetchExamStats(),
    ]);
    setIsRefreshing(false);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleAddUser = () => {
    console.log("Adding new user...");
  };

  // Transform stats for display
  const displayStats = stats ? [
    {
      title: "Tổng người dùng",
      value: stats.total_users?.toLocaleString() || "0",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Đăng ký khóa học",
      value: stats.total_registrations?.toLocaleString() || "0",
      change: `+${stats.recent_registrations || 0} (7 ngày)`,
      changeType: "positive",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Liên hệ",
      value: stats.total_contacts?.toLocaleString() || "0",
      change: `+${stats.recent_contacts || 0} (7 ngày)`,
      changeType: "positive",
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Tỷ lệ đạt",
      value: `${stats.pass_rate || 0}%`,
      change: `Điểm TB: ${stats.average_score || 0}`,
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ] : [];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isRefreshing={isRefreshing}
        />

        <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
          <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
              <div className="px-2 sm:px-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Bảng điều khiển quản lý
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Quản lý nội dung, đơn đăng ký, liên hệ và thống kê hệ thống.
                </p>
              </div>

              {/* Stats Cards */}
              {displayStats.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                  {displayStats.map((stat, index) => (
                    <DashboardCard key={stat.title} stat={stat} index={index} />
                  ))}
                </div>
              )}

              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="registrations">Đăng ký</TabsTrigger>
                  <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
                  <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
                  <TabsTrigger value="courses">Khóa học</TabsTrigger>
                  <TabsTrigger value="signs">Biển báo</TabsTrigger>
                  <TabsTrigger value="materials">Tài liệu</TabsTrigger>
                  <TabsTrigger value="exams">Thi</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
                    <div className="space-y-4 sm:space-y-6 xl:col-span-2">
                      <RevenueChart stats={stats} examStats={examStats} />
                      <UsersTable onAddUser={handleAddUser} users={adminUsers} />
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <QuickActions onAddUser={handleAddUser} onExport={handleExport} />
                      <SystemStatus items={statusItems} />
                      <RecentActivity activities={activityLogs} />
                    </div>
                  </div>
                </TabsContent>

                {/* Registrations Tab */}
                <TabsContent value="registrations" className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <h3 className="mb-4 text-lg font-semibold">Danh sách đăng ký khóa học</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Họ tên</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Điện thoại</th>
                            <th className="px-4 py-2 text-left">Khóa học</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Ngày đăng ký</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.length > 0 ? (
                            registrations.map((reg) => (
                              <tr key={reg.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{reg.full_name}</td>
                                <td className="px-4 py-2">{reg.email}</td>
                                <td className="px-4 py-2">{reg.phone}</td>
                                <td className="px-4 py-2">{reg.course_name || "N/A"}</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    reg.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    reg.status === 'studying' ? 'bg-blue-100 text-blue-800' :
                                    reg.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                                    reg.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {reg.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{new Date(reg.registered_at).toLocaleDateString('vi-VN')}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Contacts Tab */}
                <TabsContent value="contacts" className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <h3 className="mb-4 text-lg font-semibold">Danh sách liên hệ</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Họ tên</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Điện thoại</th>
                            <th className="px-4 py-2 text-left">Chủ đề</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Ngày gửi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.length > 0 ? (
                            contacts.map((contact) => (
                              <tr key={contact.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{contact.full_name}</td>
                                <td className="px-4 py-2">{contact.email}</td>
                                <td className="px-4 py-2">{contact.phone}</td>
                                <td className="px-4 py-2">{contact.subject}</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                    contact.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {contact.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{new Date(contact.created_at).toLocaleDateString('vi-VN')}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold">Danh sách câu hỏi</h3>
                      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <div className="flex items-center gap-2">
                          <Input placeholder="Tìm câu hỏi..." value={questionSearch} onChange={(e)=>setQuestionSearch(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ setQuestionPage(1); fetchQuestions(); } }} className="w-64" />
                          <select className="rounded-md border p-2" value={questionCategory} onChange={(e)=>{ setQuestionCategory(e.target.value); setQuestionPage(1); }}>
                            <option value="">Tất cả danh mục</option>
                            {categories.map(c=> (<option key={c.id} value={c.id}>{c.name}</option>))}
                          </select>
                          <select className="rounded-md border p-2" value={questionLicense} onChange={(e)=>{ setQuestionLicense(e.target.value); setQuestionPage(1); }}>
                            <option value="">Tất cả hạng</option>
                            {licenseTypes.map(l=> (<option key={l.id} value={l.id}>{l.name}</option>))}
                          </select>
                          <select className="rounded-md border p-2" value={questionPerPage} onChange={(e)=>{ setQuestionPerPage(Number(e.target.value)); setQuestionPage(1); }}>
                            {[25,50,100].map(n=> (<option key={n} value={n}>{n}/trang</option>))}
                          </select>
                          <Button variant="outline" onClick={()=>{ setQuestionPage(1); fetchQuestions(); }}>Lọc</Button>
                        </div>
                        <Button onClick={openCreateQuestion}>Thêm câu hỏi</Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Câu hỏi</th>
                            <th className="px-4 py-2 text-left">Danh mục</th>
                            <th className="px-4 py-2 text-left">Hạng</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Ngày tạo</th>
                            <th className="px-4 py-2 text-left">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.length > 0 ? (
                            questions.map((q) => (
                              <tr key={q.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 max-w-xl truncate">{q.question_text}</td>
                                <td className="px-4 py-2">{q.category_name || "N/A"}</td>
                                <td className="px-4 py-2">{q.license_name || "N/A"}</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    q.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {q.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{new Date(q.created_at).toLocaleDateString('vi-VN')}</td>
                                <td className="px-4 py-2 space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => openEditQuestion(q)}>Sửa</Button>
                                  <Button variant="outline" size="sm" onClick={() => deleteQuestion(q.id)}>Xóa</Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-gray-600">Tổng: {questionPagination.total || 0}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={questionPage<=1} onClick={()=>{ setQuestionPage(p=>Math.max(1,p-1)); }}>
                          Trang trước
                        </Button>
                        <span className="text-sm">{questionPage} / {questionPagination.last_page || 1}</span>
                        <Button variant="outline" size="sm" disabled={questionPage>=(questionPagination.last_page||1)} onClick={()=>{ setQuestionPage(p=>p+1); }}>
                          Trang sau
                        </Button>
                        <Button variant="outline" size="sm" onClick={()=>fetchQuestions()}>Tải lại</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="courses" className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Danh sách khóa học</h3>
                      <Button onClick={openCreateCourse}>Thêm khóa học</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Tên khóa học</th>
                            <th className="px-4 py-2 text-left">Hạng</th>
                            <th className="px-4 py-2 text-left">Giá</th>
                            <th className="px-4 py-2 text-left">Giá khuyến mãi</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.length > 0 ? (
                            courses.map((course) => (
                              <tr key={course.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{course.name}</td>
                                <td className="px-4 py-2">{course.license_name || "N/A"}</td>
                                <td className="px-4 py-2">{Number(course.price||0).toLocaleString('vi-VN')} ₫</td>
                                <td className="px-4 py-2">{Number(course.discount_price||0).toLocaleString('vi-VN')} ₫</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {course.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                  <Button variant="outline" size="sm" onClick={()=>openEditCourse(course)}>Sửa</Button>
                                  <Button variant="outline" size="sm" onClick={()=>deleteCourse(course.id)}>Xóa</Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Traffic Signs Tab */}
                <TabsContent value="signs" className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <h3 className="mb-4 text-lg font-semibold">Danh sách biển báo giao thông</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Mã biển</th>
                            <th className="px-4 py-2 text-left">Tên biển</th>
                            <th className="px-4 py-2 text-left">Danh mục</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Ngày tạo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trafficSigns.length > 0 ? (
                            trafficSigns.map((sign) => (
                              <tr key={sign.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{sign.sign_code}</td>
                                <td className="px-4 py-2">{sign.name}</td>
                                <td className="px-4 py-2">{sign.category_name || "N/A"}</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    sign.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {sign.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{new Date(sign.created_at).toLocaleDateString('vi-VN')}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Study Materials Tab */}
                <TabsContent value="materials" className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Danh sách tài liệu học tập</h3>
                      <Button onClick={openCreateMaterial}>Thêm tài liệu</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Tiêu đề</th>
                            <th className="px-4 py-2 text-left">Loại</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Ngày tạo</th>
                            <th className="px-4 py-2 text-left">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studyMaterials.length > 0 ? (
                            studyMaterials.map((material) => (
                              <tr key={material.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 max-w-xs truncate">{material.title}</td>
                                <td className="px-4 py-2">
                                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                    {material.material_type}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    material.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {material.is_published ? 'Công bố' : 'Nháp'}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{new Date(material.created_at).toLocaleDateString('vi-VN')}</td>
                                <td className="px-4 py-2 space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => openEditMaterial(material)}>Sửa</Button>
                                  <Button variant="outline" size="sm" onClick={() => deleteMaterial(material.id)}>Xóa</Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Exams Tab */}
                <TabsContent value="exams" className="space-y-4">
                  {examStats && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-lg border bg-white p-4">
                        <h4 className="mb-2 font-semibold">Thống kê thi</h4>
                        <div className="space-y-2 text-sm">
                          <p>Tổng bài thi: <span className="font-bold">{examStats.total_exams}</span></p>
                          <p>Đạt: <span className="font-bold text-green-600">{examStats.passed_exams}</span></p>
                          <p>Không đạt: <span className="font-bold text-red-600">{examStats.failed_exams}</span></p>
                          <p>Điểm trung bình: <span className="font-bold">{examStats.average_score}</span></p>
                          <p>Thời gian trung bình: <span className="font-bold">{examStats.average_time_spent} phút</span></p>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-white p-4">
                        <h4 className="mb-2 font-semibold">Theo hạng lái</h4>
                        <div className="space-y-2 text-sm">
                          {examStats.by_license_type && examStats.by_license_type.map((item) => (
                            <div key={item.name} className="flex justify-between">
                              <span>{item.name || 'N/A'}:</span>
                              <span className="font-bold">{item.count} (Điểm TB: {item.avg_score})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Material Modal */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold">{materialForm.id ? 'Sửa tài liệu' : 'Thêm tài liệu'}</h4>
              <button onClick={()=>setMaterialModalOpen(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                <Input value={materialForm.title} onChange={(e)=>setMaterialForm({...materialForm, title:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nội dung</label>
                <Textarea rows={6} value={materialForm.content} onChange={(e)=>setMaterialForm({...materialForm, content:e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Loại</label>
                  <select className="w-full rounded-md border p-2" value={materialForm.material_type} onChange={(e)=>setMaterialForm({...materialForm, material_type:e.target.value})}>
                    <option value="tip">tip</option>
                    <option value="experience">experience</option>
                    <option value="law">law</option>
                    <option value="technique">technique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ảnh (URL)</label>
                  <Input value={materialForm.image_url} onChange={(e)=>setMaterialForm({...materialForm, image_url:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thứ tự</label>
                  <Input type="number" value={materialForm.sort_order} onChange={(e)=>setMaterialForm({...materialForm, sort_order:Number(e.target.value)})} />
                </div>
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={!!materialForm.is_published} onChange={(e)=>setMaterialForm({...materialForm, is_published:e.target.checked})} />
                <span>Công bố</span>
              </label>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={()=>setMaterialModalOpen(false)}>Hủy</Button>
              <Button onClick={saveMaterial}>Lưu</Button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold">{questionForm.id ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</h4>
              <button onClick={()=>setQuestionModalOpen(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                <Textarea rows={3} value={questionForm.question_text} onChange={(e)=>setQuestionForm({...questionForm, question_text:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh (URL)</label>
                <Input value={questionForm.image_url||''} onChange={(e)=>setQuestionForm({...questionForm, image_url:e.target.value})} />
                <div className="mt-2 flex items-center gap-2">
                  <input type="file" accept="image/*" onChange={async (e)=>{
                    const file = e.target.files?.[0];
                    if(!file) return;
                    try {
                      const fd = new FormData();
                      fd.append('file', file);
                      fd.append('folder', 'questions');
                      const res = await fetch(`${API_BASE_URL}/admin/upload`, { method:'POST', body: fd });
                      const data = await res.json();
                      if(!res.ok || !data.success) throw new Error(data.message || 'Upload thất bại');
                      setQuestionForm(prev=>({...prev, image_url: data.url }));
                    } catch(err){
                      alert(err.message || 'Không upload được ảnh');
                    } finally {
                      e.target.value = '';
                    }
                  }} />
                </div>
                {questionForm.image_url && (
                  <div className="mt-2">
                    <Button variant="ghost" size="sm" onClick={()=>setQuestionForm(prev=>({...prev, image_url:''}))}>Xóa ảnh</Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hạng giấy phép</label>
                <select className="w-full rounded-md border p-2" value={questionForm.license_type_id||''} onChange={(e)=>setQuestionForm({...questionForm, license_type_id: e.target.value? Number(e.target.value): null})}>
                  <option value="">-- Chọn hạng --</option>
                  {licenseTypes.map((l)=> (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <select className="w-full rounded-md border p-2" value={questionForm.category_id||''} onChange={(e)=>setQuestionForm({...questionForm, category_id: e.target.value? Number(e.target.value): null})}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c)=> (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Giải thích</label>
                <Input value={questionForm.explanation||''} onChange={(e)=>setQuestionForm({...questionForm, explanation:e.target.value})} />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-6 items-center">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!questionForm.is_liability_question} onChange={(e)=>setQuestionForm({...questionForm, is_liability_question:e.target.checked})} />
                  <span>Câu điểm liệt</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!questionForm.is_active} onChange={(e)=>setQuestionForm({...questionForm, is_active:e.target.checked})} />
                  <span>Hoạt động</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="font-medium">Đáp án</h5>
                  <Button variant="outline" size="sm" onClick={addAnswer}>Thêm đáp án</Button>
                </div>
                <div className="space-y-2">
                  {questionForm.answers.map((a, idx)=> (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-10">
                        <Input placeholder={`Đáp án ${idx+1}`} value={a.answer_text} onChange={(e)=>updateAnswer(idx, { answer_text:e.target.value })} />
                      </div>
                      <label className="col-span-2 inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!a.is_correct} onChange={(e)=>updateAnswer(idx, { is_correct:e.target.checked })} />
                        <span>Đúng</span>
                      </label>
                    </div>
                  ))}
                </div>
                {questionForm.answers.length>1 && (
                  <div className="mt-1 text-right">
                    <Button variant="ghost" size="sm" onClick={()=>removeAnswer(questionForm.answers.length-1)}>Xóa đáp án cuối</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={()=>setQuestionModalOpen(false)}>Hủy</Button>
              <Button onClick={saveQuestion}>Lưu</Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold">{courseForm.id ? 'Sửa khóa học' : 'Thêm khóa học'}</h4>
              <button onClick={()=>setCourseModalOpen(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tên khóa học</label>
                <Input value={courseForm.name} onChange={(e)=>setCourseForm({...courseForm, name:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hạng</label>
                <select className="w-full rounded-md border p-2" value={courseForm.license_type_id||''} onChange={(e)=>setCourseForm({...courseForm, license_type_id: e.target.value? Number(e.target.value): null})}>
                  <option value="">-- Chọn hạng --</option>
                  {licenseTypes.map(l=> (<option key={l.id} value={l.id}>{l.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thời lượng</label>
                <Input value={courseForm.duration||''} onChange={(e)=>setCourseForm({...courseForm, duration:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <Input type="number" value={courseForm.price} onChange={(e)=>setCourseForm({...courseForm, price:Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giá khuyến mãi</label>
                <Input type="number" value={courseForm.discount_price} onChange={(e)=>setCourseForm({...courseForm, discount_price:Number(e.target.value)})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <Textarea rows={4} value={courseForm.description||''} onChange={(e)=>setCourseForm({...courseForm, description:e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!courseForm.is_active} onChange={(e)=>setCourseForm({...courseForm, is_active:e.target.checked})} />
                  <span>Hoạt động</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={()=>setCourseModalOpen(false)}>Hủy</Button>
              <Button onClick={saveCourse}>Lưu</Button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}

