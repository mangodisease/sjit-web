/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image, Select, TimePicker } from "antd";
import { getEnrolledStudents, EnrollStudent, UpdateEnrolledStudent, getAllStudents, getAllSchedules, RemoveEnrolledSchedule, getStudentImage } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

export default function Enrollment() {

    function DisplayTime(val) {
        try {
            return <>{moment(val.time[0]).format("hh:mm A")} - {moment(val.time[1]).format("hh:mm A")}</>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }

    function DisplayDate(val) {
        try {
            return <>{val.days.join(" ")}</>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }

    const columnsS = [
        {
            title: "Subject & Schedule",
            render: val => (
                <Row>
                    <Col xs={24}>
                        <span><b>Subject:</b> {val.subject}</span><br />
                        <span><b>Year Level:</b> {val.year_level}</span><br />
                        <span><b>Days:</b> {DisplayDate(val)}</span><br />
                        <span><b>Time:</b> {DisplayTime(val)}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: "Teacher",
            render: val => (
                <Row>
                    <Col xs={24} lg={7}>
                        <Image src={`${val.teacher.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.teacher.name}</span> <br />
                        <span><b>Designation:</b> {val.teacher.designation}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Button
                        disabled={selStud.length === 0}
                        type={"primary"}
                        onClick={async () => {
                            try {
                                const confirm = window.confirm("Are you sure?")
                                console.log(val)
                                const st = JSON.parse(selStud[0])._id
                                const t = val.teacher._id
                                const cs = val._id
                                console.log(list)
                                //const duplicates = list.filter(({ student, teacher, class_schedule }) => st === student._id && t === teacher._id && cs === class_schedule._id)
                               
                                const noDuplicate = true//duplicates.length === 0
                                if (confirm && noDuplicate) {
                                    setsaving(true)
                                    await EnrollStudent({
                                        student: st, teacher: t, class_schedule: cs
                                    }).then(res => {
                                        if (res.data.inserted) {
                                            alert("Added Successfully")
                                        } else {
                                            alert("Unable to add Schedule, Please try again later!")
                                        }
                                        setsaving(false)
                                        clear()
                                        setEnrolledStudents()
                                    })
                                } else {
                                    alert("Subject and schedule already enrolled!")
                                }
                            } catch (err) {
                                console.log(err.message)
                            }
                        }}
                    >
                        ENROLL
                    </Button>
                </center>
            )
        },
    ]

    const columnsE = [
        {
            title: "Subject & Schedule",
            render: val => (
                <Row>
                    <Col xs={24}>
                        <span><b>Subject:</b> {val.class_schedule.subject}</span><br />
                        <span><b>Year Level:</b> {val.class_schedule.year_level}</span><br />
                        <span><b>Days:</b> {DisplayDate(val.class_schedule)}</span><br />
                        <span><b>Time:</b> {DisplayTime(val.class_schedule)}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: "Teacher",
            render: val => (
                <Row>
                    <Col xs={24} lg={7} hidden>
                        <Image src={`${val.teacher.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.teacher.name}</span> <br />
                        <span><b>Designation:</b> {val.teacher.designation}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Button
                        type={"danger"}
                        onClick={async() => {
                            const confirm = window.confirm("Are you sure you want to remove it?")
                            if(confirm){
                                await RemoveEnrolledSchedule(val._id)
                                .then(res=>{
                                    const data = res.data
                                    console.log(data)
                                    setEnrolledStudents()
                                    alert("Schedule Remove Successfully")
                                }).catch(err=>{
                                    alert("Unable to remove schedule. Please try again later!")
                                })
                            }
                        }}
                    >
                        REMOVE
                    </Button>
                </center>
            )
        },
    ]

    const [list, setlist] = useState(null)
    const [showadd, setshowadd] = useState(false)
    const [selEnroll, setselEnroll] = useState(null)

    async function setEnrolledStudents() {
        await getEnrolledStudents()
            .then(res => {
                const data = res.data
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    async function setStudents() {
        await getAllStudents()
            .then(res => {
                const data = res.data
                setstudents(data.result)
            }).catch(err => {
                console.log(err.message)
                setstudents(null)
            })
    }

    useEffect(() => {
        setEnrolledStudents()
        setSchedules()
        setStudents()
    },
        // eslint-disable-next-line
        [])

    const [form] = Form.useForm()
    const init = {
        "subject": "",
        "course": "",
        "teacher": [],
        "days": [],
        "time": "",
        "details": ""
    }
    // eslint-disable-next-line
    const [selectedFile, setselectedFile] = useState(null)
    const [selectedFileList, setselectedFileList] = useState([])
    const [imageUrl, setimageUrl] = useState("")

    const [saving, setsaving] = useState(false)

    const [selStud, setselStud] = useState([])
    const [image, setimage] = useState(null)
    const [students, setstudents] = useState(null)


    const [schedules, setschedules] = useState(null)
    const [selSched, setselSched] = useState(null)
    const [resschedules, setresschedules] = useState(null)
    const [changeStudent, setchangeStudent] = useState(false)

    async function setSchedules() {
        await getAllSchedules()
            .then(res => {
                console.log(res.data.result)
                setschedules(res.data.result)
            }).catch(err => {
                console.log(err.message)
            })
    }
    function clear() {
        setchangeStudent(false)
        setshowadd(false)
        setselEnroll(null)
        form.resetFields()
        setimageUrl('')
        setselectedFileList([])
    }

    async function Add(file, values) {
        try {
            await EnrollStudent(values)
                .then(res => {
                    console.log(res.data)
                    if (res.data.inserted) {
                        alert("Added Successfully")
                    } else {
                        alert("Unable to add Schedule, Please try again later!")
                    }
                    setsaving(false)
                    clear()
                    setSchedules()
                })
        } catch (err) {
            console.log(err.message)
            setsaving(false)
        }
    }

    async function Update(file, values, selEnroll) {
        if (file !== null && imageUrl !== "") {
            values.image = imageUrl
        }
        console.log(values)
        if (changeStudent) {
            values.teacher = form.getFieldsValue().teacher
        }
        console.log(values)
        await UpdateSchedule(values, { _id: selEnroll._id })
            .then(res => {
                if (res.data.updated) {
                    alert("Successfully Updated!")
                    setSchedules()
                    clear()
                } else {
                    alert("Unable to update, Please try again later!")
                }
                setsaving(false)
            }).catch(err => {
                alert(err.message)
                setsaving(false)
            })


    }

    async function Submit(what, values) {
        try {
            setsaving(true)
            console.log(values)
            if (what === "Update") {
                Update(selectedFile, values, selEnroll)
            } else {
                Add(selectedFile, values)
            }
        } catch (err) {
            console.log(err.message)
            console.log(" here")
        }
    }

    function studentsOptions() {
        try {
            return <>
                {
                    students !== null && students.map((val, k) => {
                        return <Select.Option value={JSON.stringify(val)} key={k} >
                            <Col xs={24}>
                                <img src={val.image} width={20} style={{ borderRadius: 100, marginRight: 10 }} hidden />
                                {val.name}
                            </Col>
                        </Select.Option>
                    })
                }
            </>
        } catch (error) {
            return <></>
        }
    }

    function scheduleOptions() {
        try {
            return <>
                {
                    resschedules !== null ?
                        resschedules.map((val, k) => {
                            return <Select.Option value={JSON.stringify(val)} key={k} >
                                <Col xs={24}>
                                    <b>Subject:</b> {val.subject}<br />
                                    <span><b>Days:</b> {DisplayDate(val)}</span><br />
                                    <span><b>Time:</b> {DisplayTime(val)}</span>
                                </Col>
                            </Select.Option>
                        })
                        :
                        schedules !== null && schedules.map((val, k) => {
                            return <Select.Option value={JSON.stringify(val)} key={k} >
                                <Col xs={24}>
                                    <b>Subject:</b> {val.subject}<br />
                                    <span><b>Days:</b> {DisplayDate(val)}</span><br />
                                    <span><b>Time:</b> {DisplayTime(val)}</span>
                                </Col>
                            </Select.Option>
                        })
                }
            </>
        } catch (error) {
            return <></>
        }
    }

    function StudentUI(selStud, image) {
        try {
            const val = JSON.parse(selStud[0])
            return <Row gutter={[24, 5]}>
                <Col xs={24} lg={7}>
                    <Card>
                        <center><Image src={image} style={{ width: 100, height: 100, }} /></center>
                    </Card>
                </Col>
                <Col xs={24} lg={17}>
                    <Card>
                        <br />
                        <b>Name: </b> {val.name} <br />
                        <b>Course: </b> {val.course}<br />
                        <b>Year Level: </b> {val.year_level}<br />
                    </Card>
                </Col>
            </Row>
        } catch (err) {
            console.log(err.message)
            return <></>
        }
    }
    function NameUI() {
        try {
            return `of ${JSON.parse(selStud[0]).name}`
        } catch (err) {
            return ""
        }
    }

    function enrolledSched() {
        try {
            if(list!==null&&selStud.length > 0){
                const st_id = JSON.parse(selStud[0])._id
                console.log(st_id)
                console.log(list.filter(({ student })=> student === null))
                return list.filter(({ student }) => student._id === st_id )
            } else {
                return null
            }
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
    return <>

        <Row gutter={[24, 5]}>
            <Col xs={24} style={{ marginBottom: 10 }}>
                <Select
                    allowClear
                    mode="tags"
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search Student 🔎"
                    value={selStud}
                    onChange={async e => {
                        if (e.length > 1) {
                            setselStud([e[0]])

                        } else {
                            setselStud(e)
                        }
                        if(e.length!==0){
                            await getStudentImage(JSON.parse(e[0])._id)
                            .then(res=>{
                                console.log(res.data)
                                setimage(res.data.image)
                            }).catch(err=>{
                                console.log(err.message)
                                setimage(null)
                            })
                        }
                        console.log(e)
                    }}
                >
                    {studentsOptions()}
                </Select>
            </Col>
            {
                selStud.length > 0 &&
                <Col xs={24}>
                    {StudentUI(selStud, image)}
                </Col>
            }

            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>Class Schedules</b>
                            </Col>
                            <Col xs={24} lg={6} >

                            </Col>
                        </Row>
                    }
                >
                    <Table
                        className="ant-list-box table-responsive"
                        columns={columnsS}
                        loading={schedules===null}
                        dataSource={schedules}
                    />
                </Card>
            </Col>

            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>Enrolled Schedules {NameUI()}</b>
                            </Col>
                            <Col xs={24} lg={6} >

                            </Col>
                        </Row>
                    }
                >
                    <Table
                        className="ant-list-box table-responsive"
                        columns={columnsE}
                        dataSource={enrolledSched()}
                    />
                </Card>
            </Col>
        </Row>


        <Modal
            title="Enroll Student"
            onCancel={() => {
                setshowadd(false)
                clear()
            }}
            width={"95%"}
            open={showadd}
            footer={[
                <center>
                    <Button
                        type={"danger"}
                        onClick={() => {
                            setshowadd(false)
                            clear()
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        type={"primary"}
                        loading={saving}
                        onClick={() => {
                            form.submit()
                        }}
                    >
                        {
                            selEnroll === null ? saving ? "SUBMITTING" : "SUBMIT" : saving ? "UPDATING" : "UPDATE"
                        }
                    </Button>
                </center>
            ]}
        >
            <Form
                form={form}
                initialValues={init}
                onFinish={async (values) => {
                    console.log(values)
                    if (selEnroll === null) {
                        await Submit("Add", values)
                    }
                    //update
                    else {
                        if (imageUrl === "" && selectedFile === null) {
                            //dont update image
                            await Submit("Update", values, false)
                        } else {
                            //update image
                            await Submit("Update", values, true)
                        }
                    }
                }}
                onFinishFailed={err => {
                    console.log(err)
                    notification.warn({
                        message: "Please fill in the from completely!"
                    })
                }}
                alignment="horizontal"
            >
                <Row gutter={[24, 5]}>
                    <Col xs={24}>
                        <Form.Item
                            name="student"
                            label="Student"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            {
                                selEnroll !== null && changeStudent === false ?
                                    <Col xs={24}>
                                        <img src={selEnroll.teacher.image} width={20} style={{ borderRadius: 100, marginRight: 10 }} />
                                        {selEnroll.teacher.name}
                                        <Button type="link" onClick={() => {
                                            setchangeStudent(true)
                                        }}>
                                            Change?
                                        </Button>
                                    </Col>
                                    :
                                    selEnroll !== null && changeStudent === true ?
                                        <>
                                            <Select
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Please select a student"
                                                onChange={e => {
                                                    console.log(e)
                                                    form.setFieldValue("student", e)
                                                }}
                                            >
                                                {studentsOptions()}
                                            </Select>
                                            <Button type="link" onClick={() => {
                                                setchangeStudent(false)
                                                form.setFieldValue("student", selEnroll.student._id)
                                            }}>
                                                Cancel
                                            </Button>
                                        </>
                                        :
                                        <Select
                                            allowClear
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Please select a student"
                                            //defaultValue={['a10', 'c12']}
                                            onChange={e => {
                                            }}
                                        >
                                            {studentsOptions()}
                                        </Select>
                            }

                        </Form.Item>


                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="course"
                            label="Course"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="Course" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="year_level"
                            label="Year Level"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Select
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select year level"
                                options={[
                                    {
                                        label: "I",
                                        value: "I"
                                    },
                                    {
                                        label: "II",
                                        value: "II"
                                    },
                                    {
                                        label: "III",
                                        value: "III"
                                    },
                                    {
                                        label: "IV",
                                        value: "IV"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="days"
                            label="Days"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Please select days"
                                //defaultValue={['a10', 'c12']}
                                //onChange={handleChange}
                                options={[
                                    {
                                        label: "Mon",
                                        value: "Mon"
                                    },
                                    {
                                        label: "Tue",
                                        value: "Tue"
                                    },
                                    {
                                        label: "Wed",
                                        value: "Wed"
                                    },
                                    {
                                        label: "Thu",
                                        value: "Thu"
                                    },
                                    {
                                        label: "Fri",
                                        value: "Fri"
                                    },
                                    {
                                        label: "Sat",
                                        value: "Sat"
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="time"
                            label="Time"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <TimePicker.RangePicker
                                placeholder={["hh:mm", "hh:mm"]}
                                format={["hh:mm", "hh:mm"]}
                                status="" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="description"
                            label="Details"
                            rules={[
                                { required: false, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input.TextArea type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
}