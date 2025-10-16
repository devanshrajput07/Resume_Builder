import Resume from "../models/resumeModel.js";

// Create a new resume
// POST : /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title } = req.body;

        // create new resume
        const newResume = await Resume.create({ userId, title });

        //return success response
        return res.status(201).json({ message: "Resume created successfully", resume: newResume });
    } catch (error) {
        // console.error("Error creating resume:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Delete a resume
// DELETE : /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId } = req.params;

        // Find and delete the resume
        await Resume.findOneAndDelete({ userId, _id: resumeId });

        // Return success response
        return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        // console.error("Error deleting resume:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Get resume by ID
// GET : /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId } = req.params;

        // Find the resume
        const resume = await Resume.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        // Return the resume
        return res.status(200).json({ resume });
    } catch (error) {
        // console.error("Error fetching resume:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Get resume by Id Public
// GET : /api/resumes/public
export const getResumeByIdPublic = async (req, res) => {
    try {
        const { resumeId } = req.params;

        // Find the resume
        const resume = await Resume.findOne({ public: true, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Return the resume
        return res.status(200).json({ resume });
    } catch (error) {
        // console.error("Error fetching resume:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Update a resume
// PUT : /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy = JSON.parse(resumeData);

        // find and update the resume
        const resume = await Resume.findByIdAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true });

        // return success response
        return res.status(200).json({ message: "Resume updated successfully", resume });
    } catch (error) {
        // console.error("Error updating resume:", error);
        return res.status(500).json({ message: error.message });
    }
};
