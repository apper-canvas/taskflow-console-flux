import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ProjectBadge from "@/components/molecules/ProjectBadge";

const TaskCard = ({ 
  task, 
  project,
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const handleToggleComplete = () => {
    onToggleComplete(task.Id, !task.status === "completed");
  };
  
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    
    if (isToday(date)) {
      return { text: "Today", color: "text-primary", urgent: true };
    } else if (isTomorrow(date)) {
      return { text: "Tomorrow", color: "text-warning", urgent: false };
    } else if (isPast(date) && task.status !== "completed") {
      return { text: "Overdue", color: "text-error", urgent: true };
    } else {
      return { text: format(date, "MMM d"), color: "text-gray-600", urgent: false };
    }
  };
  
  const dueDateInfo = formatDueDate(task.dueDate);
  const isCompleted = task.status === "completed";
  
  return (
    <motion.div
      layout
      whileHover={{ y: -2, scale: 1.02 }}
      className={`group bg-white rounded-xl border-2 transition-all duration-200 ${
        isCompleted 
          ? "border-gray-200 bg-gray-50/50" 
          : "border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-md"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="mt-1">
            <Checkbox
              checked={isCompleted}
              onChange={handleToggleComplete}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base leading-tight ${
              isCompleted ? "text-gray-500 line-through" : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-sm mt-1 line-clamp-2 ${
                isCompleted ? "text-gray-400" : "text-gray-600"
              }`}>
                {task.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <PriorityIndicator priority={task.priority} />
            
            {/* Actions Menu */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: showActions ? 1 : 0, scale: showActions ? 1 : 0.8 }}
              className="flex items-center gap-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-7 w-7 p-0 text-gray-400 hover:text-primary"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(task)}
                className="h-7 w-7 p-0 text-gray-400 hover:text-secondary"
              >
                <ApperIcon name="Copy" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="h-7 w-7 p-0 text-gray-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </motion.div>
          </div>
        </div>
        
{/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project && (
              <ProjectBadge project={project} size="sm" />
            )}
            {task.category && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                <ApperIcon name="Tag" size={10} className="mr-1" />
                {task.category}
              </span>
            )}
          </div>
          
          {dueDateInfo && (
            <div className={`flex items-center gap-1 text-xs font-medium ${dueDateInfo.color}`}>
              <ApperIcon 
                name={dueDateInfo.urgent ? "AlertCircle" : "Calendar"} 
                size={12} 
              />
              <span>{dueDateInfo.text}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Completion Animation */}
      {isCompleted && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-1 bg-gradient-to-r from-success to-primary rounded-b-xl"
        />
      )}
    </motion.div>
  );
};

export default TaskCard;