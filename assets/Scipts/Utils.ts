import { Vec3, color } from "cc";

export function randomColor() {
    return color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
}

export function distanceBetweenPoints(point1: Vec3, point2: Vec3): number {
    const diff = point2.clone().subtract(point1);
    return diff.lengthSqr();
}

export function customIncludes<T>(array: T[], searchElement: T, fromIndex: number = 0): boolean {
    if (fromIndex >= array.length) {
        return false;
    }
    if (fromIndex < 0) {
        fromIndex = Math.max(0, array.length + fromIndex);
    }
    for (let i = fromIndex; i < array.length; i++) {
        if (array[i] === searchElement) {
            return true;
        }
    }
    return false;
}

export function getRandomElement<T>(array: T[], exclude?: T): T {
    const filteredArray = array.filter((item) => item !== exclude);
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    return filteredArray[randomIndex];
}
