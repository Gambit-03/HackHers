const mongoose = require("mongoose");

const appliedInternshipSchema = new mongoose.Schema(
	{
		studentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recruiterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		internshipId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Internship",
			required: false,
		},
		internshipTitle: { type: String },
		companyName: { type: String, required: true },
		status: {
			type: String,
			enum: [
				"applied",
				"pending",
				"reviewed",
				"shortlisted",
				"interviewing",
				"rejected",
				"offer_extended",
				"offer_received",
				"hired",
				"declined_by_student",
			],
			default: "pending",
		},
		offerDetails: {
			startDate: { type: Date },
			endDate: { type: Date },
			stipendAmount: { type: String, default: "" },
			mode: { type: String, default: "" },
			offerLetterPath: { type: String, default: "" },
			offerLetterName: { type: String, default: "" },
			offeredAt: { type: Date },
		},
	},
	{ timestamps: true }
);

appliedInternshipSchema.index(
	{ studentId: 1, internshipId: 1, internshipTitle: 1 },
	{ unique: true, partialFilterExpression: { status: { $in: ["applied", "offer_received"] } } }
);

module.exports = mongoose.model("AppliedInternship", appliedInternshipSchema);
