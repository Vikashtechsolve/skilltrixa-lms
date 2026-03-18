// This file simulates a JSON response from your backend.
// We can add all course content here.

export const courseData = {
  courseTitle: "DSA Mastery",
  modules: [
    {
      title: "Module 1",
      sessions: [
        {
          title: "Session 1",
          video: {
            title: "Introduction to Course",
            // A placeholder video
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description:
              "A brief overview of the DSA Mastery course, its structure, and what you'll learn.",
          },
          notes: {
            topic: "Introduction to Data Structures & Algorithms",
            content: [
              {
                type: "p",
                text: "Welcome to the world of Data Structures and Algorithms (DSA)! This session introduces the importance of organizing and processing data efficiently.",
              },
              { type: "h4", text: "Concepts Covered:" },
              {
                type: "ul",
                items: [
                  "What are Data Structures?",
                  "Types: Linear (Array, Stack, Queue) and Non-linear (Tree, Graph)",
                  "Introduction to Algorithms and their importance",
                  "Flow of Data through algorithms",
                ],
              },
              { type: "h4", text: "Example Code:" },
              {
                type: "code",
                text: `#include <iostream>
using namespace std;

// A simple function to print an array
void printArray(int arr[], int size) {
  for (int i = 0; i < size; i++) {
    cout << arr[i] << " ";
  }
}

int main() {
  int arr[] = {1, 2, 3, 4, 5};
  printArray(arr, 5);
  return 0;
}`,
              },
              { type: "h4", text: "Why Learn DSA?" },
              {
                type: "ul",
                items: [
                  "Helps in writing optimized and scalable code.",
                  "Builds strong problem-solving and logical thinking skills.",
                  "Essential for technical interviews.",
                ],
              },
            ],
          },
          ppt: {
            topic: "Introduction to Data Structures & Algorithms",
            // This expects an image in your /public/ folder
            slides: [
              "https://placehold.co/1280x720/1e1e1e/ffffff?text=Slide+1%0A%0AIntroduction",
              "https://placehold.co/1280x720/1e1e1e/ffffff?text=Slide+2%0A%0AWhat+is+a+Data+Structure%3F",
              "https://placehold.co/1280x720/1e1e1e/ffffff?text=Slide+3%0A%0ATypes+of+Data+Structures",
              "https://placehold.co/1280x720/1e1e1e/ffffff?text=Slide+4%0A%0AWhat+is+an+Algorithm%3F",
              "https://placehold.co/1280x720/1e1e1e/ffffff?text=Slide+5%0A%0ASummary",
            ],
            pdfUrl:
              "practice/react-app/my-react-app/src/assets/Skilltrixa PPT standard.pptx",
            embedUrl:
              "practice/react-app/my-react-app/src/assets/Skilltrixa PPT standard.pptx",
            downloadUrl: "/path/to/your/actual.pptx",
          },

          // --- ALL NEW TEST DATA ---
          test: {
            title: "Module 1 Assessment",
            description:
              "Evaluate your understanding of key Data Structure and Algorithm concepts covered in Module 1. This test includes multiple-choice questions designed to assess your grasp of topics like Arrays, Time Complexity, and Searching Techniques. Strengthen your problem-solving skills and identify areas that need revision before moving ahead.",
            note: "This short assessment helps you evaluate your understanding of core DSA concepts such as arrays, loops, logic flow, and algorithm efficiency. Review your analysis carefully to strengthen weak areas before proceeding to the next module.",
            totalQuestions: 5,
            duration: "10 minutes",
            difficulty: "Easy to Moderate",

            questions: [
              {
                text: "What is the time complexity of accessing an element in an array by its index?",
                hint: "Think about how you access an array element directly.",
                options: [
                  {
                    text: "O(n)",
                    explanation:
                      "This would be for searching an unsorted array, not accessing by index.",
                  },
                  {
                    text: "O(1)",
                    explanation:
                      "That's Right! Array elements are in contiguous memory, so they can be accessed directly in constant time.",
                  },
                  {
                    text: "O(log n)",
                    explanation:
                      "This is typical for binary search on a sorted array.",
                  },
                  {
                    text: "O(n²)",
                    explanation: "This is typical for nested loop operations.",
                  },
                ],
                correctAnswer: 1, // Index of O(1)
              },
              {
                text: "Which data structure uses the LIFO (Last In, First Out) principle?",
                hint: "Think of a stack of plates.",
                options: [
                  {
                    text: "Queue",
                    explanation:
                      "Not quite. A Queue works on FIFO (First In, First Out), like a line at a store.",
                  },
                  {
                    text: "Stack",
                    explanation:
                      "That's Right! A Stack follows the LIFO principle – the last element inserted is the first one removed.",
                  },
                  {
                    text: "Array",
                    explanation:
                      "An array is a data structure, but it doesn't inherently follow LIFO or FIFO.",
                  },
                ],
                correctAnswer: 1,
              },
              {
                text: "In which case would you prefer a linked list over an array?",
                hint: "What happens when you add or remove elements from the middle of an array?",
                options: [
                  {
                    text: "When frequent insertions and deletions are required",
                    explanation:
                      "That's Right! Linked Lists are preferred here since they don't require shifting elements like arrays do.",
                  },
                  {
                    text: "When random access is needed",
                    explanation:
                      "Not quite. Arrays are much faster for random access (O(1)) than linked lists (O(n)).",
                  },
                  {
                    text: "When memory is contiguous",
                    explanation:
                      "This is a characteristic of an array, not a reason to prefer a linked list.",
                  },
                  {
                    text: "When data size is fixed",
                    explanation: "Arrays are often used for fixed-size data.",
                  },
                ],
                correctAnswer: 0,
              },
              {
                text: "Which data structure is best suited for implementing a job scheduling system?",
                hint: "Think about which structure processes items in the order they arrive.",
                options: [
                  {
                    text: "Queue",
                    explanation:
                      "That's Right! A Queue is ideal for job scheduling systems as it follows FIFO (First In, First Out) – the first job submitted is the first one to be processed.",
                  },
                  {
                    text: "Stack",
                    explanation:
                      "Not quite. A stack is LIFO, which would mean the last job submitted gets processed first.",
                  },
                  {
                    text: "Tree",
                    explanation:
                      "Trees are for hierarchical data, not typically for sequential job processing.",
                  },
                  {
                    text: "Hash Map",
                    explanation:
                      "Hash maps are for fast lookups (key-value pairs), not for scheduling.",
                  },
                ],
                correctAnswer: 0,
              },
              {
                text: "What does 'O(n)' mean in Big O notation?",
                hint: "How does the runtime grow as the input 'n' grows?",
                options: [
                  { text: "Constant time", explanation: "That's O(1)." },
                  { text: "Logarithmic time", explanation: "That's O(log n)." },
                  {
                    text: "Linear time",
                    explanation:
                      "That's Right! It means the algorithm's runtime grows linearly with the size of the input.",
                  },
                  { text: "Quadratic time", explanation: "That's O(n²)." },
                ],
                correctAnswer: 2,
              },
            ],
          },
        },
        {
          title: "Session 2",
          // ... (Add placeholder data for session 2 here) ...
          video: { title: "Session 2 Video" },
          notes: { topic: "Session 2 Notes", content: [] },
          ppt: { topic: "Session 2 PPT", slides: [] },
          test: null, // Example: no test for this session
        },
      ],
    },
    {
      title: "Module 2",
      sessions: [
        {
          title: "Session 1",
          video: { title: "Module 2 Video" },
          notes: { topic: "Module 2 Notes", content: [] },
          ppt: { topic: "Module 2 PPT", slides: [] },
          test: null,
        },
      ],
    },
    // ... (Add Modules 3-6) ...
  ],
};
