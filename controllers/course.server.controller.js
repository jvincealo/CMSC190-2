var Course = require('mongoose').model('Course');


exports.add = function(req, res) {
    var ComputerScienceSubjects = [
        {
            code: "CMSC 1",
            title: "Introduction to Personal Computing",
            prerequisite: "",
            units: "3",
            description: "Basic use and applications of personal computers.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]

        },
        {
            code: "CMSC 2",
            title: "Introduction to the Internet",
            prerequisite: "",
            units: "3",
            description: "Tools and services of the Internet, Internet protocols, search engines, file transfer protocol (FTP), email, listservers and HTML programming.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]

        },
        {
            code: "CMSC 11",
            title: "Introduction to Computer Science",
            prerequisite: "Math 11 or Math 17",
            units: "3",
            description: "Introduction to the major areas of computer science; software systems and methodology; computer theory; computer organization and architecture.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]

        },
        {
            code: "CMSC 21",
            title: "Fundamentals of Programming",
            prerequisite: "CMSC 11",
            units: "3",
            description: "Expansion and development of materials introduced in CMSC 11; processing files and linked-lists; programming in the C language; recursion; systematic program development; top-down design and program verification.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]

        },
        {
            code: "CMSC 22",
            title: "Object-Oriented Programming",
            prerequisite: "CMSC 11",
            units: "3",
            description: "Programming using an objected-oriented language.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]

        },
        {
            code: "CMSC 56",
            title: "Discrete Mathematical Structures in Computer Science I",
            prerequisite: "MATH 17",
            units: "3",
            description: "Principles of logic, set theory, relations and functions, Boolean algebra and algebra.",
            offered: [
                                "Second Semester"
                        ]
        },
        {
            code: "CMSC 57",
            title: "Discrete Mathematical Structures in Computer Science II",
            prerequisite: "MATH 17",
            units: "3",
            description: "Principles of combinatorics, probability, algebraic systems and graph theory.",
            offered: [
                                "First Semester"
                    ]
        },
        {
            code: "CMSC 57",
            title: "Discrete Mathematical Structures in Computer Science II",
            prerequisite: "MATH 17",
            units: "3",
            description: "Principles of combinatorics, probability, algebraic systems and graph theory.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 100",
            title: "Web Programming",
            prerequisite: "CMSC 2 and CMSC 22",
            units: "3",
            description: "Developing web applications using web technologies such as CGI scripts, PHP, ASP, JavaScripts, JavaApplets, XHTML, Ajax and CSS.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 123",
            title: "Data Structures",
            prerequisite: "(CMSC 21 and CMSC 56) or COI",
            units: "3",
            description: "Abstract data types and implementation of data structures; arrays, stacks, queues, linked lists, mappings, trees, sets and graphs; internal and external searching and sorting; dynamic storage management.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 124",
            title: "Design and Implementation of Programming Languages",
            prerequisite: "CMSC 123 or COI",
            units: "3",
            description: "Study of the fundamental concepts in the design and implementation of current high-level programming languages; syntax and translation; language definition structures; elementary and structured data types; astraction mechanisms; sequence and data control; run time considerations.",
            offered: [
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 125",
            title: "Operating Systems",
            prerequisite: "CMSC 123 or COI",
            units: "3",
            description: "Processor management, memory management, file and disk management, resource management, concurrent processes, networks and distributed systems.",
            offered: [
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 127",
            title: "File processing and Database Systems",
            prerequisite: "CMSC 123 or COI",
            units: "3",
            description: "Data models: relational, network and hierarchical models; Database management system, data definition and manipulation language; Data security, integrity, synchronization, protection and recovery; Principal database systems and query languages.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 128",
            title: "Introduction to Software Engineering",
            prerequisite: "CMSC 123 or COI",
            units: "3",
            description: "Principles and methods for the design, implementation, validation, evaluation and maintenance of software systems.",
            offered: [
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 129",
            title: "Principles of Compiler Design",
            prerequisite: "CMSC 124",
            units: "3",
            description: "Fundamental concepts in the design and implementation of compilers: lexical analysis, syntax analysis, intermediate code generation, code generation and optimization.",
            offered: [
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 130",
            title: "Logic Design and Digital Computer Circuits",
            prerequisite: "CMSC 11",
            units: "3",
            description: "Data representation and computer arithmetic; logic functions and equations; description, analysis and design of combinatorial and sequential circuits; functional properties of digital integrated circuits.",
            offered: [
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 131",
            title: "Introduction to Computer Organization and Machine-Level Programming",
            prerequisite: "CMSC 130",
            units: "3",
            description: "An introduction to computer organization and interfaces between hardware and software; Microcomputer systems: basic computer organization, memory addressing, CPU-memory-I/O relationships, interfacing, interrupt mechanisms; Assembly language: data structure repreentations, program control implementations, subroutines, parameter passing, recursion, direct-video graphics, serial port communications.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 132",
            title: "Computer Architecture",
            prerequisite: "CMSC 131",
            units: "3",
            description: "Advanced topics in computer systems organization from a designer's point of view: multiprocessing, pipelining, array processors, associative processors; Microprogramming, techniques for increasing primary memory bandwidths; Modularization, interleaving, access path widening, cache and associative memories; Virtual memory; Bus structures; Multiprogramming and time sharing organizations; Network principles and protocols; Distributed resources.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 137",
            title: "Data Communications and Networking",
            prerequisite: "CMSC 125 and CMSC 132",
            units: "3",
            description: "Basic principles of data communications; design issues and protocols in the layers of data network; networks for various applications.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 140",
            title: "Advance Programming",
            prerequisite: "CMSC 21 and CMSC 56",
            units: "3",
            description: "Proof of correctness of algorithms and introduction to adance programming techniques.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 141",
            title: "Automata and Language Theory",
            prerequisite: "CMSC 124",
            units: "3",
            description: "Abstract machines and languages; finite automata, regular expressions, pushdown automata, context free languages, Turing machines and recursively enumerable languages.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 142",
            title: "Design and Analysis of Algorithms",
            prerequisite: "CMSC 123",
            units: "3",
            description: "Algorithm analysis techniques, algorithm design techniques, applications of these techniques.",
            offered: [
                        "First Semester",
                        "Second Semester"
                    ]
        },
        {
            code: "CMSC 150",
            title: "Numerical and Symbolic Computation",
            prerequisite: "(CMSC 123 and MATH 28) or MATH 38",
            units: "3",
            description: "  Computational problem solving; sources of errors in computation; iterative approximation methods and symbolic algebra; mathematical software libraries and symbolic manipulation packages.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 150",
            title: "Numerical and Symbolic Computation",
            prerequisite: "(CMSC 123 and MATH 28) or MATH 38",
            units: "3",
            description: "  Computational problem solving; sources of errors in computation; iterative approximation methods and symbolic algebra; mathematical software libraries and symbolic manipulation packages.",
            offered: [
                        "First Semester"
                    ]
        },
        {
            code: "CMSC 161",
            title: "Interactive Computer Graphics",
            prerequisite: "CMSC 123",
            units: "3",
            description: "  Computational problem solving; sources of errors in computation; iterative approximation methods and symbolic algebra; mathematical software libraries and symbolic manipulation packages.",
            offered: [
                        "Second Semester"
                    ]
        },
    ];

    Course.collection.insert(ComputerScienceSubjects, onInsert);

    function onInsert(err, docs) {
        if(err) {

        } else {
            console.log('ok');
        }
    }
}