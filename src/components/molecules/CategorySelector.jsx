import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { TaskCategoryService } from "@/services/api/TaskCategoryService";
import { cn } from "@/utils/cn";

const CategorySelector = ({ 
  value = "", 
  subcategory = "",
  onChange,
  onSubcategoryChange,
  className,
  error,
  required = false,
  showSubcategory = true,
  allowCustom = true
}) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoryData = await TaskCategoryService.getAll();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (value && value !== "custom") {
        try {
          const subs = await TaskCategoryService.getSubcategories(value);
          setSubcategories(subs);
        } catch (error) {
          console.error("Failed to load subcategories:", error);
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    };

    loadSubcategories();
  }, [value]);

  const handleCategoryChange = (selectedCategory) => {
    if (selectedCategory === "custom") {
      setShowCustomInput(true);
      onChange("");
    } else {
      setShowCustomInput(false);
      onChange(selectedCategory);
      // Clear subcategory when category changes
      if (onSubcategoryChange) {
        onSubcategoryChange("");
      }
    }
  };

  const handleCustomSubmit = () => {
    if (customCategory.trim()) {
      onChange(customCategory.trim());
      setShowCustomInput(false);
      setCustomCategory("");
    }
  };

  const selectedCategoryData = categories.find(cat => cat.name === value);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Category Selection */}
      <FormField 
        label="Category" 
        error={error}
        required={required}
      >
        <div className="space-y-2">
          <Select
            value={showCustomInput ? "custom" : value}
            onChange={(e) => handleCategoryChange(e.target.value)}
            error={error}
            disabled={loading}
          >
            <option value="">
              {loading ? "Loading categories..." : "Select a category"}
            </option>
            {categories.map((category) => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
            {allowCustom && (
              <option value="custom">+ Add Custom Category</option>
            )}
          </Select>

          {/* Category Color Indicator */}
          {selectedCategoryData && !showCustomInput && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCategoryData.color }}
              />
              <span>{selectedCategoryData.description}</span>
              {selectedCategoryData.urgency && (
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  selectedCategoryData.urgency === "urgent" && "bg-red-100 text-red-700",
                  selectedCategoryData.urgency === "high" && "bg-orange-100 text-orange-700",
                  selectedCategoryData.urgency === "medium" && "bg-yellow-100 text-yellow-700",
                  selectedCategoryData.urgency === "low" && "bg-green-100 text-green-700"
                )}>
                  {selectedCategoryData.urgency} urgency
                </span>
              )}
            </div>
          )}
        </div>
      </FormField>

      {/* Custom Category Input */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FormField label="Custom Category Name">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleCustomSubmit}
                  disabled={!customCategory.trim()}
                >
                  <ApperIcon name="Check" size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomCategory("");
                  }}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subcategory Selection */}
      {showSubcategory && subcategories.length > 0 && !showCustomInput && (
        <FormField label="Subcategory">
          <Select
            value={subcategory}
            onChange={(e) => onSubcategoryChange && onSubcategoryChange(e.target.value)}
          >
            <option value="">Select a subcategory (optional)</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </Select>
        </FormField>
      )}
    </div>
  );
};

export default CategorySelector;