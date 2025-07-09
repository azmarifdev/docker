import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ active: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
