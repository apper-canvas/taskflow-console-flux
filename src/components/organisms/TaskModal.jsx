import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null, 
  projects = []
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium",
    dueDate: "",
    category: ""
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId || "",
priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        category: task.category || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        projectId: "",
priority: "medium",
        dueDate: "",
        category: ""
      });
    }
    setErrors({});
  }, [task, isOpen]);
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const taskData = {
      ...formData,
dueDate: formData.dueDate || null,
      category: formData.category || ""
    };
    
    onSubmit(taskData);
    onClose();
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 font-display">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField 
              label="Task Title" 
              error={errors.title}
              required
            >
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title..."
                error={errors.title}
                className="text-base"
              />
            </FormField>
            
            <FormField label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Add a description..."
                rows={3}
                className="text-sm"
              />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Project">
                <Select
                  value={formData.projectId}
                  onChange={(e) => handleInputChange("projectId", e.target.value)}
                >
                  <option value="">No Project</option>
                  {projects.map((project) => (
                    <option key={project.Id} value={project.Id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              
              <FormField label="Priority">
                <div className="space-y-2">
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Select>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PriorityIndicator priority={formData.priority} size="sm" />
                    <span className="capitalize">{formData.priority} priority</span>
                  </div>
                </div>
              </FormField>
</div>
            
            <FormField label="Due Date">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </FormField>
            
            <FormField label="Category">
              <Input
                type="text"
                placeholder="Enter category (e.g., Development, Design, Testing)"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </FormField>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                className="shadow-lg"
              >
                <ApperIcon name={task ? "Save" : "Plus"} size={16} className="mr-2" />
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;