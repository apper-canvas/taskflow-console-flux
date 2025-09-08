import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  taskCount = 0,
  tasks = []
}) => {
  const hasActiveFilters = filters.status !== "all" || filters.priority !== "all";
// Get unique categories from tasks
  const categories = [...new Set(tasks?.filter(task => task.category).map(task => task.category))].sort();
  
  return (
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-900">
            Filters:
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-32"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Select>
            
            <Select
              value={filters.priority}
              onChange={(e) => onFilterChange("priority", e.target.value)}
              className="w-32"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
</Select>
            
            <Select
              value={filters.category}
              onChange={(value) => onFilterChange("category", value)}
              className="min-w-[120px]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" size={14} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {taskCount} {taskCount === 1 ? "task" : "tasks"} found
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;