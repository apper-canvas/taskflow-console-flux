import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ProjectSidebar from "@/components/organisms/ProjectSidebar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import ProjectModal from "@/components/organisms/ProjectModal";
import FilterBar from "@/components/organisms/FilterBar";
import { TaskService } from "@/services/api/TaskService";
import { ProjectService } from "@/services/api/ProjectService";

const TasksPage = () => {
  // Data State
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all"
  });
  
  // Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  
  // Load data
  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [tasksData, projectsData] = await Promise.all([
        TaskService.getAll(),
        ProjectService.getAll()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load tasks and projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  // Filter and search tasks
  const filteredTasks = useMemo(() => {
return tasks.filter(task => {
      // Project filter
      if (selectedProject && task.projectId !== selectedProject.Id) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query);
        const matchesProject = projects.find(p => p.Id === task.projectId)?.name.toLowerCase().includes(query);
        const matchesCategory = task.category?.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesDescription && !matchesProject && !matchesCategory) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }
      
      // Category filter
      if (filters.category !== "all" && task.category !== filters.category) {
        return false;
      }
      
      return true;
    });
  }, [tasks, selectedProject, searchQuery, filters, projects]);
  
  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const activeTasks = tasks.filter(task => task.status === "active");
    const completedTasks = tasks.filter(task => task.status === "completed");
    const total = activeTasks.length + completedTasks.length;
    
    if (total === 0) return 0;
    return Math.round((completedTasks.length / total) * 100);
  }, [tasks]);
  
  // Get task count for projects
  const projectsWithTaskCount = useMemo(() => {
    return projects.map(project => ({
      ...project,
      taskCount: tasks.filter(task => 
        task.projectId === project.Id && task.status === "active"
      ).length
    }));
  }, [projects, tasks]);
  
  const allTasksCount = tasks.filter(task => task.status === "active").length;
  
  // Task CRUD operations
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await TaskService.create({
        ...taskData,
        status: "active",
        createdAt: new Date().toISOString(),
        completedAt: null,
        order: tasks.length + 1
      });
      
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      console.error(err);
    }
  };
  
  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await TaskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ));
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    }
  };
  
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await TaskService.update(taskId, {
        status: completed ? "completed" : "active",
        completedAt: completed ? new Date().toISOString() : null
      });
      
      setTasks(prev => prev.map(t => 
        t.Id === taskId ? updatedTask : t
      ));
      
      if (completed) {
        toast.success("🎉 Task completed!");
      } else {
        toast.info("Task marked as active");
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error(err);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      await TaskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error(err);
    }
  };
  
  const handleDuplicateTask = async (task) => {
    try {
      const newTask = await TaskService.create({
        title: `${task.title} (Copy)`,
        description: task.description,
        projectId: task.projectId,
        priority: task.priority,
        dueDate: task.dueDate,
        status: "active",
        createdAt: new Date().toISOString(),
        completedAt: null,
        order: tasks.length + 1
      });
      
      setTasks(prev => [...prev, newTask]);
      toast.success("Task duplicated successfully!");
    } catch (err) {
      toast.error("Failed to duplicate task");
      console.error(err);
    }
  };
  
  // Project CRUD operations
  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await ProjectService.create({
        ...projectData,
        createdAt: new Date().toISOString(),
        taskCount: 0
      });
      
      setProjects(prev => [...prev, newProject]);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error("Failed to create project");
      console.error(err);
    }
  };
  
  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await ProjectService.update(editingProject.Id, projectData);
      setProjects(prev => prev.map(project => 
        project.Id === editingProject.Id ? updatedProject : project
      ));
      toast.success("Project updated successfully!");
    } catch (err) {
      toast.error("Failed to update project");
      console.error(err);
    }
  };
  
  // Modal handlers
  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setEditingTask(null);
    setTaskModalOpen(false);
  };
  
  const openProjectModal = (project = null) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };
  
  const closeProjectModal = () => {
    setEditingProject(null);
    setProjectModalOpen(false);
  };
  
  const handleTaskSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };
  
  const handleProjectSubmit = (projectData) => {
    if (editingProject) {
      handleUpdateProject(projectData);
    } else {
      handleCreateProject(projectData);
    }
  };
  
  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };
  
const handleClearFilters = () => {
    setFilters({ status: "all", priority: "all", category: "all" });
    setSearchQuery("");
    setSelectedProject(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateTask={() => openTaskModal()}
        onCreateProject={() => openProjectModal()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        completionPercentage={completionPercentage}
      />
      
      <div className="flex">
        <ProjectSidebar
          projects={projectsWithTaskCount}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onCreateProject={() => openProjectModal()}
          allTasksCount={allTasksCount}
        />
        
        <main className="flex-1 min-h-screen">
<FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            taskCount={filteredTasks.length}
            tasks={tasks}
          />
          
          <div className="p-6">
            <TaskList
              tasks={filteredTasks}
              projects={projects}
              loading={loading}
              error={error}
              onRetry={loadData}
              onToggleComplete={handleToggleComplete}
              onEditTask={openTaskModal}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              selectedProject={selectedProject}
            />
          </div>
        </main>
      </div>
      
      <TaskModal
        isOpen={taskModalOpen}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        projects={projects}
      />
      
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={closeProjectModal}
        onSubmit={handleProjectSubmit}
        project={editingProject}
      />
    </div>
  );
};

export default TasksPage;