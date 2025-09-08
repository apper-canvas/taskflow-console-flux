class TaskCategoryServiceClass {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_category_c'; // Future table for structured categories
    
    // Default category structure for current implementation
    this.defaultCategories = [
      {
        Id: 1,
        name: "Development",
        subcategories: ["Frontend", "Backend", "Mobile", "DevOps", "Testing"],
        urgency: "medium",
        description: "Software development and technical tasks",
        color: "#3B82F6"
      },
      {
        Id: 2,
        name: "Design",
        subcategories: ["UI/UX", "Graphics", "Branding", "Wireframes", "Prototyping"],
        urgency: "low",
        description: "Design and creative tasks",
        color: "#EC4899"
      },
      {
        Id: 3,
        name: "Documentation",
        subcategories: ["API Docs", "User Guides", "Technical Specs", "Requirements"],
        urgency: "low",
        description: "Documentation and content creation",
        color: "#10B981"
      },
      {
        Id: 4,
        name: "Testing",
        subcategories: ["Unit Testing", "Integration", "E2E Testing", "Performance"],
        urgency: "high",
        description: "Quality assurance and testing tasks",
        color: "#F59E0B"
      },
      {
        Id: 5,
        name: "Security",
        subcategories: ["Audit", "Penetration Testing", "Compliance", "Access Control"],
        urgency: "urgent",
        description: "Security and compliance tasks",
        color: "#EF4444"
      },
      {
        Id: 6,
        name: "Performance",
        subcategories: ["Optimization", "Monitoring", "Scaling", "Caching"],
        urgency: "high",
        description: "Performance optimization tasks",
        color: "#8B5CF6"
      },
      {
        Id: 7,
        name: "Marketing",
        subcategories: ["Content", "Social Media", "Campaigns", "Analytics"],
        urgency: "low",
        description: "Marketing and promotional tasks",
        color: "#F97316"
      },
      {
        Id: 8,
        name: "Research",
        subcategories: ["User Research", "Market Analysis", "Competitive Analysis", "Surveys"],
        urgency: "medium",
        description: "Research and analysis tasks",
        color: "#06B6D4"
      },
      {
        Id: 9,
        name: "Planning",
        subcategories: ["Sprint Planning", "Retrospectives", "Strategy", "Roadmap"],
        urgency: "medium",
        description: "Planning and strategic tasks",
        color: "#84CC16"
      }
    ];
  }

  // Get all categories (currently returns default structure, will use database when table is available)
  async getAll() {
    try {
      // TODO: Replace with actual database call when task_category_c table is available
      // const params = {
      //   fields: [
      //     {"field": {"Name": "Id"}},
      //     {"field": {"Name": "name_c"}},
      //     {"field": {"Name": "subcategories_c"}},
      //     {"field": {"Name": "urgency_c"}},
      //     {"field": {"Name": "description_c"}},
      //     {"field": {"Name": "color_c"}}
      //   ],
      //   orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
      //   pagingInfo: {"limit": 100, "offset": 0}
      // };
      // 
      // const response = await this.apperClient.fetchRecords(this.tableName, params);
      // 
      // if (!response.success) {
      //   console.error(response.message);
      //   return this.defaultCategories;
      // }
      // 
      // return response.data.map(category => ({
      //   Id: category.Id,
      //   name: category.name_c,
      //   subcategories: category.subcategories_c ? category.subcategories_c.split(',') : [],
      //   urgency: category.urgency_c,
      //   description: category.description_c,
      //   color: category.color_c
      // }));

      // Simulate database delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...this.defaultCategories];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return this.defaultCategories;
    }
  }

  // Get category by ID
  async getById(id) {
    try {
      const categories = await this.getAll();
      const category = categories.find(cat => cat.Id === parseInt(id));
      
      if (!category) {
        throw new Error("Category not found");
      }
      
      return category;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Get categories by name (for filtering and search)
  async getByName(name) {
    try {
      const categories = await this.getAll();
      return categories.filter(cat => 
        cat.name.toLowerCase().includes(name.toLowerCase()) ||
        cat.subcategories.some(sub => sub.toLowerCase().includes(name.toLowerCase()))
      );
    } catch (error) {
      console.error(`Error searching categories for "${name}":`, error?.response?.data?.message || error);
      return [];
    }
  }

  // Get all unique category names (for existing task compatibility)
  async getCategoryNames() {
    try {
      const categories = await this.getAll();
      return categories.map(cat => cat.name).sort();
    } catch (error) {
      console.error("Error fetching category names:", error?.response?.data?.message || error);
      return ["Development", "Design", "Documentation", "Testing", "Security", "Performance", "Marketing", "Research", "Planning"];
    }
  }

  // Get subcategories for a specific category
  async getSubcategories(categoryName) {
    try {
      const categories = await this.getAll();
      const category = categories.find(cat => cat.name === categoryName);
      return category ? category.subcategories : [];
    } catch (error) {
      console.error(`Error fetching subcategories for "${categoryName}":`, error?.response?.data?.message || error);
      return [];
    }
  }

  // Create new category (placeholder for future database implementation)
  async create(categoryData) {
    try {
      // TODO: Implement with actual database when table is available
      // const params = {
      //   records: [{
      //     name_c: categoryData.name,
      //     subcategories_c: categoryData.subcategories.join(','),
      //     urgency_c: categoryData.urgency,
      //     description_c: categoryData.description,
      //     color_c: categoryData.color
      //   }]
      // };
      // 
      // const response = await this.apperClient.createRecord(this.tableName, params);
      // 
      // if (!response.success) {
      //   console.error(response.message);
      //   throw new Error(response.message);
      // }

      // Mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory = {
        Id: Date.now(), // Temporary ID generation
        name: categoryData.name,
        subcategories: categoryData.subcategories || [],
        urgency: categoryData.urgency || "medium",
        description: categoryData.description || "",
        color: categoryData.color || "#6366F1"
      };

      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Update category (placeholder for future database implementation)
  async update(id, updateData) {
    try {
      // TODO: Implement with actual database when table is available
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const categories = await this.getAll();
      const existingCategory = categories.find(cat => cat.Id === parseInt(id));
      
      if (!existingCategory) {
        throw new Error("Category not found");
      }

      return {
        ...existingCategory,
        ...updateData,
        Id: parseInt(id)
      };
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Delete category (placeholder for future database implementation)
  async delete(id) {
    try {
      // TODO: Implement with actual database when table is available
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const TaskCategoryService = new TaskCategoryServiceClass();