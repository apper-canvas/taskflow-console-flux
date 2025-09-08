import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { TaskCategoryService } from "@/services/api/TaskCategoryService";
import { cn } from "@/utils/cn";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subcategories: [],
    urgency: "medium",
    description: "",
    color: "#6366F1"
  });
  const [newSubcategory, setNewSubcategory] = useState("");

  const colorOptions = [
    "#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B", 
    "#10B981", "#3B82F6", "#06B6D4", "#84CC16", "#F97316"
  ];

  const urgencyOptions = [
    { value: "low", label: "Low", color: "text-green-700 bg-green-100" },
    { value: "medium", label: "Medium", color: "text-yellow-700 bg-yellow-100" },
    { value: "high", label: "High", color: "text-orange-700 bg-orange-100" },
    { value: "urgent", label: "Urgent", color: "text-red-700 bg-red-100" }
  ];

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TaskCategoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSubcategory = () => {
    if (newSubcategory.trim() && !formData.subcategories.includes(newSubcategory.trim())) {
      setFormData(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory.trim()]
      }));
      setNewSubcategory("");
    }
  };

  const removeSubcategory = (subcategory) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(sub => sub !== subcategory)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subcategories: [],
      urgency: "medium",
      description: "",
      color: "#6366F1"
    });
    setNewSubcategory("");
    setEditingCategory(null);
    setShowCreateForm(false);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      subcategories: [...category.subcategories],
      urgency: category.urgency,
      description: category.description,
      color: category.color
    });
    setEditingCategory(category);
    setShowCreateForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        const updatedCategory = await TaskCategoryService.update(editingCategory.Id, formData);
        setCategories(prev => 
          prev.map(cat => cat.Id === editingCategory.Id ? updatedCategory : cat)
        );
        toast.success("Category updated successfully!");
      } else {
        const newCategory = await TaskCategoryService.create(formData);
        setCategories(prev => [...prev, newCategory]);
        toast.success("Category created successfully!");
      }
      
      resetForm();
    } catch (error) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
      console.error(error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      await TaskCategoryService.delete(categoryId);
      setCategories(prev => prev.filter(cat => cat.Id !== categoryId));
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCategories} />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Manage task categories, subcategories, and urgency levels</p>
        </div>
        <Button
          variant="accent"
          onClick={() => setShowCreateForm(true)}
          className="shadow-lg"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => (
          <motion.div
            key={category.Id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="h-8 w-8 p-0"
                >
                  <ApperIcon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.Id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">{category.description}</p>

            {/* Urgency Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                urgencyOptions.find(opt => opt.value === category.urgency)?.color
              )}>
                {urgencyOptions.find(opt => opt.value === category.urgency)?.label} Urgency
              </span>
              <span className="text-xs text-gray-500">
                {category.subcategories.length} subcategories
              </span>
            </div>

            {/* Subcategories */}
            {category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {sub}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{category.subcategories.length - 3} more
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <Empty 
          message="No categories found"
          description="Create your first category to get started with organized task management"
          action={
            <Button variant="accent" onClick={() => setShowCreateForm(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Category
            </Button>
          }
        />
      )}

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="h-8 w-8 p-0"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Category Name */}
                <FormField label="Category Name" required>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter category name..."
                  />
                </FormField>

                {/* Description */}
                <FormField label="Description">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe this category..."
                    rows={3}
                  />
                </FormField>

                {/* Color Selection */}
                <FormField label="Color">
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleInputChange("color", color)}
                        className={cn(
                          "w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110",
                          formData.color === color 
                            ? "ring-2 ring-offset-2 ring-gray-400 scale-110" 
                            : ""
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </FormField>

                {/* Urgency Level */}
                <FormField label="Default Urgency Level">
                  <Select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange("urgency", e.target.value)}
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                {/* Subcategories */}
                <FormField label="Subcategories">
                  <div className="space-y-3">
                    {/* Add New Subcategory */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="Add subcategory..."
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubcategory())}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addSubcategory}
                        disabled={!newSubcategory.trim()}
                      >
                        <ApperIcon name="Plus" size={16} />
                      </Button>
                    </div>

                    {/* Existing Subcategories */}
                    {formData.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.subcategories.map((sub) => (
                          <div
                            key={sub}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                          >
                            <span>{sub}</span>
                            <button
                              type="button"
                              onClick={() => removeSubcategory(sub)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <ApperIcon name="X" size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormField>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                  >
                    <ApperIcon name={editingCategory ? "Save" : "Plus"} size={16} className="mr-2" />
                    {editingCategory ? "Update Category" : "Create Category"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;