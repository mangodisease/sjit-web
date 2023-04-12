/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image, Select } from "antd";
import { getAllStudents, AddStudent, UpdateStudent } from "../api";
import { useEffect, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import moment from "moment";

export default function Students() {

    const columns = [
        {
            title: "Student",
            render: val => (
                <Row>
                    <Col xs={24} lg={7}>
                        <Image src={`${val.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.name}</span> <br />
                        <span><b>Birthdate:</b> {moment(val.birthdate).format("MM-DD-YYYY")}</span>
                    </Col>
                </Row>
            )
        },
        {
            title: "Course - Level",
            render: val => (
                <span>
                    <b>Course: </b> {val.course} <br />
                    <b>Year Level: </b> {val.year_level}
                </span>
            )
        },
        {
            title: "Parents",
            render: val => (
                <span>
                    <b>Name: </b>{val.parent}
                    <br />
                    <b>Contact #: </b>{val.parent_contact}
                </span>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Row>
                        <Col lg={12} xs={24} style={{ marginBottom: 10 }}>
                            <Button
                                type={"primary"}
                                onClick={() => {
                                    setshowadd(true)
                                    val.birthdate = moment(val.birthdate)
                                    setselStud(val)
                                    form.setFieldsValue(val)
                                }}
                            >
                                EDIT
                            </Button>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Button
                                type={"danger"}
                                onClick={() => {

                                }}
                            >
                                DELETE
                            </Button>
                        </Col>

                    </Row>
                </center>
            )
        },
    ]

    const [list, setlist] = useState(null)
    const [showadd, setshowadd] = useState(false)
    const [selStud, setselStud] = useState(null)

    async function setStudents() {
        await getAllStudents()
            .then(res => {
                const data = res.data
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(async () => {
        await setStudents()
    },
        // eslint-disable-next-line
        [])

    const [form] = Form.useForm()
    const init = {
        "name": "",
        "course": "",
        "year_level": "",
        "birthdate": "",
        "parent": "",
        "parent_contact": "",
        "username": "",
        "password": "123456789"
    }
    // eslint-disable-next-line
    const [selectedFile, setselectedFile] = useState(null)
    const [selectedFileList, setselectedFileList] = useState([])
    const [imageUrl, setimageUrl] = useState("")

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const onChange = e => {
        if (e.file.type.includes("image")) {
            switch (e.file.status) {
                case "uploading":
                    setselectedFileList([e.file]);
                    setimageUrl("");
                    console.log("uploading")
                    console.log(e.file)
                    break;
                case "done":
                    console.log(e.file)
                    setselectedFile(e.file.originFileObj);
                    setselectedFileList([e.file]);
                    getBase64(e.file.originFileObj, (url) => {
                        setimageUrl(url);
                    });

                    break;

                default:
                    setimageUrl("");
                    setselectedFile(null);
                    setselectedFileList([]);
            }
        } else {
            notification.info({
                message: "Select an image file only!"
            })
        }

    };

    function clear() {
        setshowadd(false)
        setselStud(null)
        form.resetFields()
        setimageUrl('')
        setselectedFileList([])
    }
    const [saving, setsaving] = useState(false)

    async function Add(file, values) {
        try {
            if (file !== null) {
                const formData = new FormData();
                formData.append("File", file);
                formData.append("body", JSON.stringify(values));

                await AddStudent(formData)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.isAdded) {
                            notification.success({
                                message: "Student Successfully Added!",
                                placement: "topRight"
                            })
                            setStudents()
                            setTimeout(() => {
                                setsaving(false)
                                clear()
                            }, 1500)
                        } else {
                            notification.warning({
                                message: res.data.msg,
                                placement: "topRight"
                            })
                            setTimeout(() => {
                                setsaving(false)
                            }, 1500)
                        }
                    }).catch(err => {
                        console.error(err.message)
                        setsaving(false)
                        notification.error({
                            message: "Server Error! please try again later!",
                            placement: "topRight"
                        })
                    })
            } else {
                notification.info({
                    message: "Please insert/select a image!"
                })
            }
        } catch (err) {
            console.log(err.message)
            setsaving(false)
        }
    }

    async function Update(file, values, selStud) {
        let formData = new FormData();     
        values._id = selStud._id
        if(file==null){
            formData.append("body", JSON.stringify(values));
        } else {
            if(imageUrl!==""){ values.image = imageUrl; values.updateImage = true }
            formData.append("File", file);
            formData.append("body", JSON.stringify(values));
        }
        await UpdateStudent(formData)
        .then(res=>{
            if(res.data.updated){
                alert("Successfully Updated!")
                setStudents()
                clear()
            } else {
                alert("Unable to update, Please try again later!")
            }
            setsaving(false)
        }).catch(err=>{
            alert(err.message)
            setsaving(false)
        })

        
    }

    async function Submit(what, values) {
        try {
            setsaving(true)
            console.log(values)
            if (what === "Update") {
                Update(selectedFile, values, selStud)
            } else {
                Add(selectedFile, values)
            }
        } catch (err) {
            console.log(err.message)
            console.log(" here")
        }
    }

    return <>
        <Modal
            title="Add Student"
            onCancel={() => {
                if(!saving){
                    setshowadd(false)
                    clear()
                }
            }}
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
                            selStud === null ? saving? "SUBMITTING" : "SUBMIT" : saving? "UPDATING" : "UPDATE"
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
                    if (selStud === null) {
                        if (imageUrl === "" && selectedFile === null) {
                            notification.warning({
                                message: "Please select/insert a product image to upload!",
                                placement: "topRight"
                            })
                        } else {
                            values.image = imageUrl
                            await Submit("Add", values)
                        }
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
                        <b>Basic Information</b>
                        <hr/>
                        <center>
                            <Upload
                                fileList={selectedFileList}
                                customRequest={dummyRequest}
                                onChange={e => {
                                    console.log(e)
                                    onChange(e)
                                }}
                            >

                                <Col xs={24} >
                                    <Image
                                        style={{ pointer: "cursor", borderRadius: 100 }}
                                        width={200}
                                        height={200}
                                        src={selStud === null ? imageUrl : imageUrl!==""? imageUrl : selStud.image}
                                        fallback={logo}
                                        preview={false}
                                    />
                                </Col>

                                <center>
                                    <Button type="link" style={{ color: "black" }} >
                                        <ToTopOutlined style={{ fontSize: 20, color: "green" }} /> {"SELECT AN IMAGE"}
                                    </Button>
                                </center>
                            </Upload>

                        </center>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="name"
                            label="Fullname"
                            rules={[
                                { required: true, message: "Please input your fullname!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g. John Doe" />
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
                            <Input type="text" placeholder="" />
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
                                style={{
                                    width: "100%",
                                }}
                                options={[
                                    {
                                        label: 'I',
                                        value: 'I',
                                    },
                                    {
                                        label: 'II',
                                        value: 'II',
                                    },
                                    {
                                        label: 'III',
                                        value: 'III',
                                    },
                                    {
                                        label: 'IV',
                                        value: 'IV',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="birthdate"
                            label="Birthdate"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} format={"MM-DD-YYYY"} placeholder="MM-DD-YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="parent"
                            label="Parent"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="parent_contact"
                            label="Parent Contact"
                            rules={[
                                { required: true, message: "Please input parent contact!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g.09123456789" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24}>
                        <b>Account Details</b>
                        <hr/>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter username!" },
                            ]}
                        >
                            <Input type="text" placeholder="username" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: "Please enter password!" },
                            ]}
                        >
                            <Input.Password size="small" placeholder="password" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <Row gutter={[24, 5]}>
            <Col xs={24}>

            </Col>
            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>List of Students</b>
                            </Col>
                            <Col xs={24} lg={6} >
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setshowadd(true)
                                    }}
                                    style={{ float: "right" }}
                                >
                                    Add Student
                                </Button>
                            </Col>
                        </Row>
                    }
                >
                    <Table
                        className="ant-list-box table-responsive"
                        columns={columns}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}