export function getMotivationalMessage(score: number): string {
    if (score === 0) {
        return ",,Try plugging in your keyboard!\"";
    }
    else if (score > 0 && score <= 5) {
        return ",,Not bad, FOR A NOOB!\"";
    }
    else if (score > 5 && score <= 10) {
        return ",,How's the retirment home grandpa?\"";
    }
    else if (score > 10 && score <= 20) {
        return ",,Slow down before you break a hip!\"";
    }
    else if(score > 20) {
        return ",,Wow! What a gamer!\"";
    }
    else {
        return "How did you get here?";
    }
}