import React, { useState, useEffect } from 'react';
import StudentList from '../StudentList';
import {
    getAllStudents,
    getStudentById,
    getStudentsByEducationLevel,
    getStudentsByFirstName,
    getStudentsByLastName,
    getStudentsByOtherName,
    getStudentsByGender,
    getStudentsBySchoolName
} from './studentService';
import { Container, Form, Row, Col, ButtonGroup, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { fetchStudents } from '../../utilities/fetchStudentData';
import { saveAs } from 'file-saver'; // You may need to install with `npm install file-saver`

async function downloadCSV(students, fileName = "students_data.csv") {
    const headers = [
        "studID", "studName", "firstName", "lastName", "otherName", "gender", "phone", "email", "educationLevel", "schoolName", "schoolAddress", "pointsBalance", "NumberOfExams", "accountCreationDate", "accountStatus"
    ];
    const rows = students.map(student => [
        `"${student.studID}"`,
        `"${student.studName}"`,
        `"${student.firstName}"`,
        `"${student.lastName}"`,
        `"${student.otherName || ''}"`, // Handle null or undefined values
        `"${student.gender}"`,
        `"${student.phone || ''}"`, // Handle null or undefined values
        `"${student.email}"`,
        `"${student.educationLevel}"`,
        `"${student.schoolName}"`,
        `"${student.schoolAddress}"`,
        `"${student.pointsBalance}"`,
        `${student.Results ? student.Results.length : 0}`, // No need for quotes, it's a number
        `"${student.accountCreatedDate}"`,
        `"${student.accountStatus}"`,
    ]);

    // Convert array of arrays into CSV string
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
}



const StudentContainer = () => {

    const { userInfo } = useAuth();
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [loader, setLoader] = useState(false);
    const [refreshResults, setRefreshResults] = useState(false);
    const [download, setDownload] = useState(false);

    const itemsPerPage = 10;

    //Fetches all students' data
    useEffect(() => {
        async function InitialloadStudents() {
            //Fetch all students data from server-side and save in indexdb
            // console.log("Checking whether user is an admin or staff");
            if (userInfo.labels.includes("admin") || userInfo.labels.includes("staff")) {
                // console.log('Fetching student data');
                await fetchStudents().then(data => {
                    // console.log('Students data Fetch successfully');
                }).catch(error => {
                    console.error('Failed to fetch students');
                });
            }
        }

        InitialloadStudents();

    }, [])

    useEffect(() => {
        const loadStudents = async () => {
            try {
                setLoader(true); // Start loading before the operation
                let loadedStudents = await getAllStudents() || [];
                switch (filter) {
                    case 'id':
                        loadedStudents = [await getStudentById(filterValue)].filter(student => student);
                        break;
                    case 'educationLevel':
                        loadedStudents = await getStudentsByEducationLevel(filterValue);
                        break;
                    case 'firstName':
                        loadedStudents = await getStudentsByFirstName(filterValue);
                        break;
                    case 'lastName':
                        loadedStudents = await getStudentsByLastName(filterValue);
                        break;
                    case 'otherName':
                        loadedStudents = await getStudentsByOtherName(filterValue);
                        break;
                    case `schoolName`:
                        loadedStudents = await getStudentsBySchoolName(filterValue);
                    case 'gender':
                        loadStudents = await getStudentsByGender(filterValue);
                    case 'all':
                    default:
                        loadedStudents = await getAllStudents();
                        break;
                }
                setStudents(loadedStudents);
            } catch (err) {
                console.error(err);
            } finally {
                setLoader(false); // Stop loading after operation completes
            }
        };

        if (filter !== 'all' && filterValue === '') {
            setStudents([]);
            setLoader(false); // Also make sure to handle the loader when clearing students

        } else {
            loadStudents();
        }
    }, [filter, filterValue]);

    const refreshStudentsData = async () => {
        try {
            setRefreshResults(true);

            //Fetch all students data from server-side and save in indexdb
            // console.log("Checking whether user is an admin or staff");
            if (userInfo.labels.includes("admin") || userInfo.labels.includes("staff")) {
                // console.log('Fetching student data');
                await fetchStudents(true).then(data => {
                    // console.log('Students data Fetch successfully');
                }).catch(error => {
                    console.error('Failed to fetch students');
                });
            }
        } catch (e) { console.error('Failed to fetch students: ' + e); } finally {
            setRefreshResults(false);
            // window.location.reload();
        }
    }

    const handleDownload = async () => {
        setDownload(true);
        let studentsToDownload = [];
        try {
            // Check if there is a specific filter applied and fetch data accordingly
            if (filter !== 'all' && filterValue !== '') {
                switch (filter) {
                    case 'id':
                        const student = await getStudentById(filterValue);
                        if (student) {
                            studentsToDownload = [student];
                        }
                        break;
                    case 'educationLevel':
                        studentsToDownload = await getStudentsByEducationLevel(filterValue);
                        break;
                    case 'firstName':
                        studentsToDownload = await getStudentsByFirstName(filterValue);
                        break;
                    case 'lastName':
                        studentsToDownload = await getStudentsByLastName(filterValue);
                        break;
                    case 'otherName':
                        studentsToDownload = await getStudentsByOtherName(filterValue);
                        break;
                    case 'gender':
                        studentsToDownload = await getStudentsByGender(filterValue);
                        break;
                    case 'schoolName':
                        studentsToDownload = await getStudentsBySchoolName(filterValue);
                        break;
                    default:
                        break;
                }
            } else {
                // If no specific filter is applied or the filter value is empty, download all students
                studentsToDownload = await getAllStudents();
            }

            if (studentsToDownload.length > 0) {
                await downloadCSV(studentsToDownload);
            } else {
                console.log('No data to download for the selected filter.');
            }
        } catch (error) {
            console.error('Error downloading CSV:', error);
        } finally {
            setDownload(false);
        }
    };


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container style={{ paddingTop: '1.2rem' }}>
            <Form className="mb-4">
                <Row>
                    <Col md={6}>
                        <Form.Select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            aria-label="Filter selection"
                            className="mb-3"
                        >
                            <option value="all">All Students</option>
                            <option value="id">By Student ID</option>
                            <option value="educationLevel">By Education Level</option>
                            <option value="firstName">By First Name</option>
                            <option value="lastName">By Last Name</option>
                            <option value="otherName">By Other Name</option>
                            <option value="schoolName">By School Name</option>
                            <option value="gender">By Gender</option>
                        </Form.Select>
                        {filter !== 'all' && (
                            <Form.Control
                                type="text"
                                value={filterValue}
                                onChange={e => setFilterValue(e.target.value)}
                                placeholder={`Enter ${filter}`}
                                className="mb-3"
                            />
                        )}
                    </Col>
                    <Col>
                        <ButtonGroup>
                            <Button variant="outline-secondary" onClick={handleDownload} disabled={download}>
                                {download ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faDownload} className="me-2" />}
                                Download CSV
                            </Button>
                            <Button variant="outline-success" onClick={refreshStudentsData} disabled={refreshResults}>
                                {refreshResults ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faRefresh} className="me-2" />}
                                Refresh List
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Form>
            <StudentList
                StudentList={students}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                paginate={paginate}
                loader={loader}
            />
        </Container>
    );
};

export default StudentContainer;
