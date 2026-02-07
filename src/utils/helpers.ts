export class DateHelper {
    /**
     * Format date to YYYY-MM-DD format
     */
    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    /**
     * Format time to HH:MM format
     */
    static formatTime(time: string): string {
        return time.substring(0, 5);
    }

    /**
     * Check if date is valid
     */
    static isValidDate(date: any): boolean {
        return date instanceof Date && !isNaN(date.getTime());
    }

    /**
     * Calculate age from date of birth
     */
    static calculateAge(dateOfBirth: Date): number {
        const today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
        ) {
            age--;
        }

        return age;
    }
}

export class FileHelper {
    /**
     * Get file extension
     */
    static getFileExtension(filename: string): string {
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    /**
     * Generate safe filename
     */
    static generateSafeFilename(originalName: string): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const ext = this.getFileExtension(originalName);
        return `${timestamp}-${random}.${ext}`;
    }
}
