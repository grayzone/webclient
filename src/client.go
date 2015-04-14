package main

import (
	"bufio"
	"bytes"
	"code.google.com/p/go-uuid/uuid"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"
)

type Param struct {
	Mailbox               string `xml:"mailbox,omitempty"`
	UserName              string `xml:"username,omitempty"`
	Password              string `xml:"password,omitempty"`
	DeviceURL             string `xml:"device_uri,omitempty"`
	URL                   string `xml:"url,omitempty"`
	Country               string `xml:"country,omitempty"`
	Address               string `xml:"address,omitempty"`
	Facility              string `xml:"facility,omitempty"`
	NotificationOID       string `xml:"notification_oid,omitempty"`
	SessionID             string `xml:"sessionID,omitempty"`
	Hardware              string `xml:"hardware,omitempty"`
	HardwareVersion       string `xml:"hardware_version,omitempty"`
	Software              string `xml:"software,omitempty"`
	SoftwareVersion       string `xml:"software_version,omitempty"`
	HardwareOptions       string `xml:"hardware_options,omitempty"`
	SoftwareOptions       string `xml:"software_option,omitempty"`
	SoftwareOptionVersion string `xml:"software_option_version,omitempty"`
	AgentStatus           string `xml:"agent_status,omitempty"`
	DataReady             string `xml:"data_ready,omitempty"`
	Datetime              string `xml:"datetime,omitempty"`
	JobStatus             string `xml:"job_status,omitempty"`
	LastUpdate            string `xml:"last_update,omitempty"`
	ServerAvailable       string `xml:"server_available,omitempty"`
	ServerStatus          string `xml:"server_status,omitempty"`
	UploadTime            string `xml:"upload_time,omitempty"`
	DownloadTime          string `xml:"download_time,omitempty"`
	Reason                string `xml:"reason,omitempty"`
	Timestamp             string `xml:"timestamp,omitempty"`
	CacheTimeOut          string `xml:"cache_timeout,omitempty"`
	Format                string `xml:"format,omitempty"`
}

type UserLogin struct {
	Country        string       `xml:"country"`
	PassExpiration string       `xml:"passExpiration"`
	Permissions    *Permissions `xml:"permissions"`
	CovidienUser   string       `xml:"covidien_user"`
	Training       *Training    `xml:"training"`
}

type Permissions struct {
	Permission []Permission `xml:"permissoin"`
}

type Permission struct {
	DeviceType      string `xml:"device_type"`
	UserAccess      string `xml:"user_access"`
	TestingSoftware string `xml:"testing_software"`
}

type Training struct {
	DeviceType []string `xml:"device_type"`
}

type Notifications struct {
	Notification []Notification `xml:"notification"`
}

type Notification struct {
	OID    string             `xml:"oid,attr"`
	Header NotificationHeader `xml:"header"`
	Body   NotificationBody   `xml:"body"`
}

type NotificationHeader struct {
	NotificationType    string `xml:"notification_type,attr"`
	NotificationAction  string `xml:"notification_action,attr"`
	PertinentType       string `xml:"pertinent_type"`
	PertinentIdentifier string `xml:"pertinent_identifier"`
	NotificationID      string `xml:"notification_id,omitempty"`
}

type Log struct {
	Name string `xml:"name,attr"`
	//	TransferEncoding string `xml:"transfer_encoding"`
	Meta   Meta   `xml:"meta"`
	URLInc string `xml:"uri_inc"`
}

type Meta struct {
	HttpEquiv string `xml:"http-equiv,attr"`
	Content   string `xml:"content,attr"`
}

type Logs struct {
	Log []Log `xml:"log"`
}

type NotificationBody struct {
	Components      *Components  `xml:"components,omitempty"`
	NcSysConfig     *NCSysConfig `xml:"system_config,omitempty"`
	Logs            *Logs        `xml:"logs,omitempty"`
	Features        *Features    `xml:"features,omitempty"`
	URI             string       `xml:"uri,omitempty"`
	SoftwareVersion string       `xml:"software_version,omitempty"`
	FileSize        string       `xml:"file_size,omitempty"`
	MD5Sum          string       `xml:"md5sum,omitempty"`
	Software        string       `xml:"software,omitempty"`
	Version         string       `xml:"version,omitempty"`
	UpdateType      string       `xml:"update_type,omitempty"`
	Expiration      string       `xml:"expiration,omitempty"`
	IsAccessible    string       `xml:"is_Accessible,omitempty"`
}

type NCSysConfig struct {
	ConfigType string     `xml:"type,attr"`
	NCConfig   []NCConfig `xml:"config"`
}

type NCConfig struct {
	ConfigType string      `xml:"type,attr"`
	Component  []Component `xml:"component"`
}

type Components struct {
	Component []Component `xml:"component"`
}

type Component struct {
	ComponentType  string    `xml:"type,attr"`
	Name           string    `xml:"name,omitempty"`
	PartNumber     string    `xml:"part_number,omitempty"`
	Revision       string    `xml:"revision,omitempty"`
	SerialNumber   string    `xml:"serial_number,omitempty"`
	Rights         *Rights   `xml:"rights,omitempty"`
	TimeStamp      string    `xml:"timestamp,omitempty"`
	Status         string    `xml:"status,omitempty"`
	URI            string    `xml:"uri,omitempty"`
	Location       string    `xml:"location,omitempty"`
	Filesize       string    `xml:"file_size,omitempty"`
	MD5            string    `xml:"md5,omitempty"`
	Nid            string    `xml:"nid,omitempty"`
	SoftwareStatus string    `xml:"softwareStatus,omitempty"`
	Language       string    `xml:"language,omitempty"`
	DocumentType   string    `xml:"documentType,omitempty"`
	Features       *Features `xml:"features,omitempty"`
}

type Rights struct {
	Right []string `xml:"right"`
}

type Features struct {
	Feature []Feature `xml:"feature"`
}

type Feature struct {
	Type                    string `xml:"type,attr,omitempty"`
	ID                      string `xml:"feature_id"`
	Name                    string `xml:"feature_name"`
	Description             string `xml:"feature_desc,omitempty"`
	StartDate               string `xml:"start_date,omitempty"`
	EndDate                 string `xml:"end_date,omitempty"`
	Duration                string `xml:"feature_duration,omitempty"`
	Term                    string `xml:"feature_term,omitempty"`
	LicenseKey              string `xml:"license_key,omitempty"`
	LicenseSerialNumber     string `xml:"license_serialnumber,omitempty"`
	UpgradeRequired         string `xml:"sw_upgrade_required,omitempty"`
	Status                  string `xml:"status,omitempty"`
	SoftwareUpgradeRequired string `xml:"software_upgrade_required,omitempty"`
}

type Notes struct {
	Note []Note `xml:"note"`
}

type Note struct {
	Oid        string             `xml:"oid,attr"`
	Header     NotificationHeader `xml:"header"`
	Components *Components        `xml:"components,omitempty"`
}

type Request struct {
	Type         string        `xml:"type,attr"`
	Xaction      string        `xml:"xaction_guid,attr"`
	Params       *Param        `xml:"params,omitempty"`
	Notification *Notification `xml:"notification"`
}

type Response struct {
	Type          string         `xml:"type,attr"`
	Xaction       string         `xml:"xaction_guid,attr"`
	Params        *Param         `xml:"params,omitempty"`
	UserLogin     *UserLogin     `xml:"userlogin,omitempty"`
	Notifications *Notifications `xml:"notifications,omitempty"`
	Notes         *Notes         `xml:"notes,omitempty"`
}

type Message struct {
	XMLName       xml.Name  `xml:"message"`
	SchemaVersion string    `xml:"schema_version,attr"`
	SessionID     string    `xml:"session_guid,attr,omitempty"`
	Request       *Request  `xml:"request"`
	Response      *Response `xml:"response"`
}

func (msg Message) toString() string {
	output, _ := xml.MarshalIndent(msg, "  ", "    ")
	result := xml.Header + string(output)
	return result
}

type MessageString struct {
	Request  string
	Response string
	Status   string
	ReqMsg   Message
	ResMsg   Message
}

const MESSAGE_SCHEMA_VERSION = "3644767c-2632-411a-9416-44f8a7dee08e"
const MESSAGE_ACTION_DEVICE_INFO = "532ffdda-6f38-41da-9a40-cb0801e6695f"
const MESSAGE_ACTION_DEVICE_SOFTWARE_UPGRADE_PACKAGE = "24637560-edb3-4961-b17d-14e74f74457c"
const MESSAGE_ACTION_DEVICE_SOFTWARE_DOWNLOAD_ACK = "91dec715-f256-421a-8560-e6b015dae5f9"
const MESSAGE_ACTION_FEATURE_ENTITLED = "832ffdda-6f38-a1dc-9af0-cb0801e6695d"
const MESSAGE_ACTION_DEVICE_DECODED_LOG = "8e74db99-f0a3-4de4-aeed-f17afb6896fc"

// const MESSAGE_APPLICATION_CLIENT_INFO = "198703BE-DD8B-4bc9-B67D-53B0B8092990"
const MESSAGE_APPLICATION_CLIENT_INFO = "APPLICATION_CLIENT_INFO"

const SERVICE_NAME_LAPTOPAGENT = "DeviceManagementAgent"
const SERVICE_NAME_BOOTLOADER = "DeviceManagementAgentBootLoader"

const FILE_PATH_AGENT_CONFIG = "C:\\Program Files\\Covidien\\Device Management Agent\\resource\\conf.properties"
const FILE_PATH_AGENT_LOG_CONFIG = "C:\\Program Files\\Covidien\\Device Management Agent\\resource\\log4j.properties"
const FILE_PATH_AGENT_LOG = "C:\\var\\log\\agent\\laptopAgent.log"

const COOKIE_SESSION_ID = "session_id"

const FOLDER_DEVICE_LOG = "c:\\logs"

func renderHandler(w http.ResponseWriter, r *http.Request, templatepath string) {
	t, err := template.ParseFiles(templatepath)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	t.Execute(w, nil)
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	renderHandler(w, r, "template/index.html")
}

func cryptHandler(w http.ResponseWriter, r *http.Request) {
	renderHandler(w, r, "template/crypt.html")
}

func ReadFromAgent(conn net.Conn, request []byte) ([]byte, error) {

	result := bytes.NewBuffer(nil)
	var buf [10240]byte
	conn.Write(request)
	/*
		result, err := ReadFromSocket(conn)
		if err != nil {
			return nil, err
		}
	*/
	n, _ := conn.Read(buf[0:])
	result.Write(buf[0:n])
	return result.Bytes(), nil
}

func ReadFromSocket(conn net.Conn) ([]byte, error) {
	result := bytes.NewBuffer(nil)
	var buf [512]byte
	for {
		n, err := conn.Read(buf[0:])
		result.Write(buf[0:n])
		if err != nil {
			if err == io.EOF {
				break
			}
			return nil, err
		}
	}
	return result.Bytes(), nil
}

func (m *MessageString) ProcessMessage(ip string) error {

	conn, err := net.Dial("tcp", ip+":9999")

	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	defer conn.Close()

	fmt.Println(">>>>>>>>>>>>>>")
	fmt.Println(m.Request)
	fmt.Println("|------------|")

	result, err := ReadFromAgent(conn, []byte(m.Request))
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	m.Response = string(result)
	//	m.FormatResponse()
	fmt.Println("<<<<<<<<<<<<")
	fmt.Println(m.Response)
	fmt.Println("|------------|")
	return nil
}

func (m *MessageString) FormatResponse() {
	xml.Unmarshal([]byte(m.Response), &m.ResMsg)
	output, _ := xml.MarshalIndent(m.ResMsg, "  ", "    ")

	m.Response = string(output)
}

func (m *MessageString) InitRequest(t string, r *http.Request) error {
	m.ReqMsg.SchemaVersion = MESSAGE_SCHEMA_VERSION
	req := &Request{}
	m.ReqMsg.Request = req
	req.Type = t
	req.Xaction = uuid.NewUUID().String()

	param := &Param{}
	req.Params = param
	param.Timestamp = fmt.Sprintf("%d", time.Now().Unix())

	sessionid, err := r.Cookie(COOKIE_SESSION_ID)
	if err != nil {
		return err
	}
	m.ReqMsg.SessionID = sessionid.Value
	return nil

}

func (m *MessageString) GetStatus() {

	if m.ResMsg.Response != nil {
		m.Status = m.ResMsg.Response.Type
		if m.Status == "bad" {
			if m.ResMsg.Response.Params != nil {
				reason := m.ResMsg.Response.Params.Reason
				m.Status = m.Status + ":" + reason
			}
		}
	}
}

func (m *MessageString) SendResponse(w http.ResponseWriter) error {
	b, err := json.Marshal(m)
	if err != nil {
		fmt.Fprint(w, m)
		return err
	}
	fmt.Fprint(w, string(b))
	return nil
}

func sendHandler(w http.ResponseWriter, r *http.Request) {

	msg := MessageString{}
	msg.Request = r.FormValue("request")
	ip := r.FormValue("agentip")
	msg.ProcessMessage(ip)
	msg.FormatResponse()
	msg.Status = msg.ResMsg.Response.Type
	viewHandler(w, r)
}

func getStatusHandler(w http.ResponseWriter, r *http.Request) {

	msg := MessageString{}
	msg.InitRequest("getstatus", r)

	msg.Request = msg.ReqMsg.toString()

	ip := r.FormValue("agentip")

	msg.ProcessMessage(ip)
	msg.FormatResponse()
	msg.GetStatus()

	msg.SendResponse(w)

}

func createSessionHandler(w http.ResponseWriter, r *http.Request) {

	msg := MessageString{}
	msg.InitRequest("createsession", r)

	msg.Request = msg.ReqMsg.toString()

	ip := r.FormValue("agentip")
	msg.ProcessMessage(ip)
	msg.FormatResponse()
	msg.GetStatus()

	res := msg.ResMsg
	if res.Response.Params != nil {
		if len(res.Response.Params.SessionID) > 0 {
			expiration := time.Now()
			expiration = expiration.AddDate(1, 0, 0)
			cookie := http.Cookie{Name: COOKIE_SESSION_ID, Value: res.Response.Params.SessionID, Expires: expiration}
			http.SetCookie(w, &cookie)
		}
	}

	err := msg.SendResponse(w)
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(msg)
	}

}

func closeSessionHandler(w http.ResponseWriter, r *http.Request) {

	msg := MessageString{}
	err := msg.InitRequest("closesession", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {
		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
		cookie := http.Cookie{Name: COOKIE_SESSION_ID, MaxAge: -1}
		http.SetCookie(w, &cookie)
	}

	msg.SendResponse(w)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("login", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		param.UserName = r.PostFormValue("username")
		param.Password = r.PostFormValue("password")

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func logoffHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("logoff", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		param.UserName = r.PostFormValue("username")

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func selfRegHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("register", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {
		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func statdeviceHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("statdevice", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		devicetype := r.PostFormValue("devicetype")
		serialnumber := r.PostFormValue("serialnumber")

		param.DeviceURL = fmt.Sprintf("{%s}/{%s}", devicetype, serialnumber)

		param.Country = r.PostFormValue("country")

		usenc := r.PostFormValue("usenc")
		fmt.Println(usenc)
		if usenc == "true" {
			param.Format = "named_configuration"
		}

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func createdeviceHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("createdevice", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		devicetype := r.PostFormValue("devicetype")
		serialnumber := r.PostFormValue("serialnumber")

		param.DeviceURL = fmt.Sprintf("{%s}/{%s}", devicetype, serialnumber)

		param.Country = r.PostFormValue("country")

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func getheaderHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("getheaders", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		devicetype := r.PostFormValue("devicetype")
		serialnumber := r.PostFormValue("serialnumber")

		param.DeviceURL = fmt.Sprintf("{%s}/{%s}", devicetype, serialnumber)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)

}

func postNotificationHandler(w http.ResponseWriter, r *http.Request) {

	msg := MessageString{}
	err := msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		devicetype := r.PostFormValue("devicetype")
		serialnumber := r.PostFormValue("serialnumber")

		param.DeviceURL = fmt.Sprintf("{%s}/{%s}", devicetype, serialnumber)

		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = uuid.NewUUID().String()
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "create"
		ntf.Header.PertinentType = fmt.Sprintf("%s/%s", devicetype, MESSAGE_ACTION_DEVICE_INFO)
		ntf.Header.PertinentIdentifier = serialnumber

		cpnts := &Components{}
		ntf.Body.Components = cpnts

		r.ParseForm()
		sw := r.PostFormValue("software")
		hw := r.PostFormValue("hardware")

		swcomponent := []Component{}
		hwcomponent := []Component{}
		json.Unmarshal([]byte(sw), &swcomponent)
		json.Unmarshal([]byte(hw), &hwcomponent)

		for i, _ := range hwcomponent {
			hwcomponent[i].ComponentType = "hardware"
			cpnts.Component = append(cpnts.Component, hwcomponent[i])
		}

		for i, _ := range swcomponent {
			swcomponent[i].ComponentType = "software"
			cpnts.Component = append(cpnts.Component, swcomponent[i])
		}

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func getNotificationByOIDHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("getnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		oid := r.PostFormValue("oid")
		param.NotificationOID = oid

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)

}

func clientUpdateHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		devicetypeuid := r.PostFormValue("devicetypeuid")
		devicetypename := r.PostFormValue("devicetypename")
		country := r.PostFormValue("country")

		param.Country = country

		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = uuid.NewUUID().String()
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "create"
		ntf.Header.PertinentType = fmt.Sprintf("%s/%s", devicetypeuid, MESSAGE_APPLICATION_CLIENT_INFO)
		ntf.Header.PertinentIdentifier = devicetypename

		cpnts := &Components{}
		ntf.Body.Components = cpnts

		r.ParseForm()
		sw := r.PostFormValue("software")

		swcomponent := []Component{}
		json.Unmarshal([]byte(sw), &swcomponent)

		fmt.Println(swcomponent)

		for i, _ := range swcomponent {
			//			swcomponent[i].ComponentType = "software"
			cpnts.Component = append(cpnts.Component, swcomponent[i])
		}

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func getRulesHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("getheaders", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		param := msg.ReqMsg.Request.Params

		r.ParseForm()
		devicetype := r.PostFormValue("devicetype")
		devicetypename := r.PostFormValue("devicetypename")

		param.DeviceURL = fmt.Sprintf("{%s}/{%s}", devicetype, devicetypename)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)

}

func openPDF(filepath string) error {

	pdfreader := "C:\\Program Files\\Covidien\\Device Management Agent\\SumatraPDF.exe"
	c := exec.Command(pdfreader, filepath)
	error := c.Run()

	return error

}

func viewDocumentHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = r.PostFormValue("oid")
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "create"

		s := r.PostFormValue("pertinent_type")
		ntf.Header.PertinentType = s
		ntf.Header.PertinentIdentifier = s[strings.Index(s, "/")+1:]

		cpnts := &Components{}
		ntf.Body.Components = cpnts

		r.ParseForm()
		component := Component{}

		component.ComponentType = "document"
		component.Filesize = r.PostFormValue("file_size")
		component.MD5 = r.PostFormValue("md5")
		component.Location = r.PostFormValue("location")

		cpnts.Component = append(cpnts.Component, component)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()

		go openPDF(msg.ResMsg.Response.Notifications.Notification[0].Body.Components.Component[0].Location)
	}

	msg.SendResponse(w)
}

func upgradeSoftwareHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = r.PostFormValue("oid")
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "create"

		s := r.PostFormValue("pertinent_type")
		index := strings.Index(s, "/")
		ntf.Header.PertinentType = s[:index] + "/" + MESSAGE_ACTION_DEVICE_SOFTWARE_DOWNLOAD_ACK
		ntf.Header.PertinentIdentifier = r.PostFormValue("pertinent_identifier")

		cpnts := &Components{}
		ntf.Body.Components = cpnts

		r.ParseForm()
		component := Component{}

		component.ComponentType = "software"
		component.PartNumber = r.PostFormValue("part_number")
		component.Revision = r.PostFormValue("revision")
		component.Name = r.PostFormValue("softwarename")
		component.Status = "start"

		const layout = "1/2/2006 3:04:00 PM"
		component.TimeStamp = time.Now().Format(layout)

		cpnts.Component = append(cpnts.Component, component)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func sendInstallStatusHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {

		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = r.PostFormValue("oid")
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "create"

		s := r.PostFormValue("pertinent_type")
		index := strings.Index(s, "/")
		ntf.Header.PertinentType = s[:index] + "/" + MESSAGE_ACTION_DEVICE_SOFTWARE_DOWNLOAD_ACK
		ntf.Header.PertinentIdentifier = r.PostFormValue("pertinent_identifier")

		cpnts := &Components{}
		ntf.Body.Components = cpnts

		r.ParseForm()
		component := Component{}

		component.ComponentType = "software"
		component.PartNumber = r.PostFormValue("part_number")
		component.Revision = r.PostFormValue("revision")
		component.Name = r.PostFormValue("softwarename")
		component.Status = r.PostFormValue("installstatus")

		const layout = "1/2/2006 3:04:00 PM"
		component.TimeStamp = time.Now().Format(layout)

		cpnts.Component = append(cpnts.Component, component)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func changeFeatureStatusHandler(w http.ResponseWriter, r *http.Request) {
	msg := MessageString{}
	err := msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {
		/*
			param := &Param{}
			msg.ReqMsg.Request.Params = param

			param.Timestamp = fmt.Sprintf("%d", time.Now().Unix())
		*/
		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = uuid.NewUUID().String()
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "post"

		r.ParseForm()
		devicetype := r.PostFormValue("devicetype")
		ntf.Header.PertinentType = devicetype + "/" + MESSAGE_ACTION_FEATURE_ENTITLED

		serialnumber := r.PostFormValue("serialnumber")
		ntf.Header.PertinentIdentifier = serialnumber

		features := &Features{}
		ntf.Body.Features = features

		feature := Feature{}

		feature.ID = r.PostFormValue("id")
		feature.Name = r.PostFormValue("name")
		feature.Duration = r.PostFormValue("duration")
		feature.Term = r.PostFormValue("term")
		feature.LicenseKey = r.PostFormValue("licensekey")
		feature.LicenseSerialNumber = r.PostFormValue("licenseserialnumber")
		feature.Status = r.PostFormValue("status")
		feature.StartDate = r.PostFormValue("startdate")

		features.Feature = append(features.Feature, feature)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func uploadLogHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(0)

	//	fmt.Println(r)

	file, header, err := r.FormFile("uploadfile")
	defer file.Close()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	filename := header.Filename

	//	fmt.Println(filename)

	logfilepath := FOLDER_DEVICE_LOG + "\\" + filename

	out, err := os.Create(logfilepath)
	if err != nil {
		fmt.Println("can not create the tmp file.")
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		fmt.Println(err.Error() + " " + logfilepath)
		return
	}

	msg := MessageString{}
	err = msg.InitRequest("postnotification", r)

	if err != nil {
		msg.Status = err.Error()
		msg.Request = msg.ReqMsg.toString()
	} else {
		/*
			param := &Param{}
			msg.ReqMsg.Request.Params = param

			param.Timestamp = fmt.Sprintf("%d", time.Now().Unix())
		*/
		ntf := &Notification{}
		msg.ReqMsg.Request.Notification = ntf

		ntf.OID = uuid.NewUUID().String()
		ntf.Header.NotificationType = "event"
		ntf.Header.NotificationAction = "create"

		devicetype := r.FormValue("devicetype")
		fmt.Println(devicetype)
		ntf.Header.PertinentType = devicetype + "/" + MESSAGE_ACTION_DEVICE_DECODED_LOG

		serialnumber := r.FormValue("serialnumber")
		ntf.Header.PertinentIdentifier = serialnumber

		logs := &Logs{}
		ntf.Body.Logs = logs

		log := Log{}

		log.Meta.Content = "gzip"
		log.Meta.HttpEquiv = "transfer-encoding"

		log.Name = r.FormValue("logtype")
		log.URLInc = logfilepath

		logs.Log = append(logs.Log, log)

		msg.Request = msg.ReqMsg.toString()
		ip := r.FormValue("agentip")
		msg.ProcessMessage(ip)
		msg.FormatResponse()
		msg.GetStatus()
	}

	msg.SendResponse(w)
}

func staticHandler(w http.ResponseWriter, r *http.Request) {
	//	fmt.Println(r.URL.Path[1:])

	http.ServeFile(w, r, r.URL.Path[1:])
}

func serviceManage(name string, cmd string) error {

	c := exec.Command("sc", cmd, name)
	error := c.Run()

	return error

}

func ServiceManageLogHandler(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()
	name := r.PostFormValue("name")
	command := r.PostFormValue("command")

	err := serviceManage(name, command)
	if err != nil {
		fmt.Println(err.Error())
		fmt.Fprint(w, err.Error())
		return
	}
	fmt.Println("ok")
	fmt.Fprint(w, "ok")
}

func getURLFromConfig() (string, error) {
	file, err := os.Open(FILE_PATH_AGENT_CONFIG)
	if err != nil {
		return "", err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	for _, v := range lines {
		if strings.Index(strings.ToUpper(v), "SERVER.WEBSERVICE.URL") == 0 {
			result := v[strings.Index(v, "=")+1:]
			return result, nil
		}
	}
	return "", nil
}

func UpdateURLInConfig(url string) error {
	data, err := ioutil.ReadFile(FILE_PATH_AGENT_CONFIG)
	if err != nil {
		return err
	}

	strData := string(data)
	lines := strings.Split(strData, "\n")

	for i, v := range lines {
		if strings.Index(strings.ToUpper(v), "SERVER.WEBSERVICE.URL") == 0 {
			strs := strings.Split(v, "=")
			lines[i] = strs[0] + "=" + url
		}
	}
	modstr := []byte(strings.Join(lines, "\n"))
	ioutil.WriteFile(FILE_PATH_AGENT_CONFIG, modstr, os.ModeAppend)

	return nil
}

func getLogLevelFromConfig() (string, error) {
	file, err := os.Open(FILE_PATH_AGENT_LOG_CONFIG)
	if err != nil {
		return "", err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}
	for _, v := range lines {
		if strings.Index(strings.ToLower(v), "log4j.rootlogger") == 0 {
			result := v[strings.Index(v, "=")+1:]
			return result, nil
		}
	}
	return "", nil
}

func emptyLog() error {

	return ioutil.WriteFile(FILE_PATH_AGENT_LOG, []byte(""), os.ModeExclusive)

}

func UpdateLogLevelInConfig(url string) error {
	data, err := ioutil.ReadFile(FILE_PATH_AGENT_LOG_CONFIG)
	if err != nil {
		return err
	}

	strData := string(data)
	lines := strings.Split(strData, "\n")

	for i, v := range lines {
		if strings.Index(strings.ToLower(v), "log4j.rootlogger") == 0 {
			strs := strings.Split(v, "=")
			lines[i] = strs[0] + "=" + url
		}
	}
	modstr := []byte(strings.Join(lines, "\n"))
	ioutil.WriteFile(FILE_PATH_AGENT_LOG_CONFIG, modstr, os.ModeAppend)

	return nil
}

func getServiceURLHandler(w http.ResponseWriter, r *http.Request) {
	result, err := getURLFromConfig()
	if err != nil {
		fmt.Println(err.Error())
		fmt.Fprint(w, err.Error())
		return
	}
	fmt.Println("ok")
	fmt.Fprint(w, result)
}

func updateServiceURLHandler(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()
	url := r.PostFormValue("url")
	fmt.Println(url)
	if url != "" {
		err := UpdateURLInConfig(url)
		if err != nil {
			fmt.Println(err.Error())
			fmt.Fprint(w, err.Error())
			return
		}
	}

	fmt.Println("ok")
	fmt.Fprint(w, "ok")
}

func getLogLevelHandler(w http.ResponseWriter, r *http.Request) {
	result, err := getLogLevelFromConfig()
	if err != nil {
		fmt.Println(err.Error())
		fmt.Fprint(w, err.Error())
		return
	}
	fmt.Println("ok")
	fmt.Fprint(w, result)
}

func updateLogLevelHandler(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()
	url := r.PostFormValue("loglevel")
	fmt.Println(url)
	if url != "" {
		err := UpdateLogLevelInConfig(url)
		if err != nil {
			fmt.Println(err.Error())
			fmt.Fprint(w, err.Error())
			return
		}
	}

	fmt.Println("ok")
	fmt.Fprint(w, "ok")
}

func emptyLogHandler(w http.ResponseWriter, r *http.Request) {

	err := emptyLog()
	if err != nil {
		fmt.Println(err.Error())
		fmt.Fprint(w, err.Error())
		return
	}

	fmt.Println("ok")
	fmt.Fprint(w, "ok")
}

func readFile(filepath string, w http.ResponseWriter) {
	data, err := ioutil.ReadFile(filepath)
	if err != nil {
		fmt.Fprint(w, err.Error())
	}
	fmt.Fprint(w, string(data))

}

func logHandler(w http.ResponseWriter, r *http.Request) {

	filepath := "C:\\var\\log\\agent\\laptopAgent.log"
	readFile(filepath, w)

}

func getConfigHandler(w http.ResponseWriter, r *http.Request) {

	filepath := "C:\\Program Files\\Covidien\\Device Management Agent\\resource\\conf.properties"
	readFile(filepath, w)

}

func main() {

	http.HandleFunc("/template/", staticHandler)

	http.HandleFunc("/", viewHandler)
	http.HandleFunc("/crypt", cryptHandler)

	http.HandleFunc("/sendMessage", sendHandler)
	http.HandleFunc("/getstatus", getStatusHandler)
	http.HandleFunc("/createsession", createSessionHandler)
	http.HandleFunc("/closesession", closeSessionHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/logoff", logoffHandler)
	http.HandleFunc("/statdevice", statdeviceHandler)
	http.HandleFunc("/createdevice", createdeviceHandler)
	http.HandleFunc("/getheaders", getheaderHandler)
	http.HandleFunc("/postnotification", postNotificationHandler)
	http.HandleFunc("/getnotificationbyoid", getNotificationByOIDHandler)
	http.HandleFunc("/viewdocument", viewDocumentHandler)
	http.HandleFunc("/upgradesoftware", upgradeSoftwareHandler)
	http.HandleFunc("/sendinstallstatus", sendInstallStatusHandler)
	http.HandleFunc("/changefeaturestatus", changeFeatureStatusHandler)
	http.HandleFunc("/uploadlog", uploadLogHandler)

	http.HandleFunc("/clientupdate", clientUpdateHandler)
	http.HandleFunc("/getrules", getRulesHandler)

	http.HandleFunc("/servicemanage", ServiceManageLogHandler)

	http.HandleFunc("/getserviceurl", getServiceURLHandler)
	http.HandleFunc("/updateserviceurl", updateServiceURLHandler)

	http.HandleFunc("/getloglevel", getLogLevelHandler)
	http.HandleFunc("/updateloglevel", updateLogLevelHandler)
	http.HandleFunc("/emptylog", emptyLogHandler)

	http.HandleFunc("/selfreg", selfRegHandler)

	http.HandleFunc("/log", logHandler)
	http.HandleFunc("/config", getConfigHandler)

	http.ListenAndServe(":1234", nil)

}
