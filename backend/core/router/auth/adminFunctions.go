package core

import (
	utils "github.com/Le-Monde-3-0/utils/sources"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"net/http"
)

type RegisterInput struct {
	Email    string `json:"email" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Identifier string `json:"identifier" binding:"required"`
	Password   string `json:"password" binding:"required"`
}

type ChangeUserPasswordInput struct {
	Email string `json:"email" binding="required"`
	Password string `json:"password" binding="required"`
	NewPassword string `json:"newpassword" binding="required"`
}

type ChangeUsernameInput struct {
	Email string `json:"email" binding="required"`
	Password string `json:"password" binding="required"`
	NewUsername string `json:"newusername" binding="required"`
}

type ChangeUserMailInput struct {
	Email string `json:"email" binding="required"`
	Password string `json:"password" binding="required"`
	NewEmail string `json:"newemail" binding="required"`
}

type User struct {
	Id        uint
	Email     string
	Username  string
	Password  string
	IsPrivate bool
}

var (
	requestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests.",
		},
		[]string{"method"},
	)
)

func init() {
	prometheus.MustRegister(requestsTotal)
}

// @BasePath /api/v1

// Register godoc
// @Schemes
// @Description Create a user
// @Tags authentication
// @Accept json
// @Produce json
// @Param RegisterInput body RegisterInput true "Params to create an account"
// @Success 200 {object} RegisterResponse
// @Failure      400  {object}  HTTPError400
// @Failure      409  {object}  HTTPError409
// @Failure      500  {object}  HTTPError500
// @Router /register [post]
func Register(c *gin.Context, logger *zap.Logger) {

	var registerParams RegisterInput

	if err := c.ShouldBindJSON(&registerParams); err != nil {
		logger.Error(err.Error())
		utils.NewError(c, http.StatusBadRequest, err)
		return
	}
	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://auth-lemonde3-0:8081/register", registerParams)
	if err != nil {
		logger.Error(err.Error())
		utils.NewError(c, statusCode, err)
		return
	}
	c.Data(statusCode, "application/json", responseBody)
	requestsTotal.WithLabelValues("GET").Inc()
}

// Login godoc
// @Schemes
// @Description Get an authentication token
// @Tags authentication
// @Accept json
// @Produce json
// @Param LoginInput body LoginInput true "Params to login to account"
// @Success 200 {object} LoginResponse
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /login [post]
func Login(c *gin.Context, logger *zap.Logger) {
	var loginParams LoginInput

	if err := c.ShouldBindJSON(&loginParams); err != nil {
		logger.Error("Invalid request body")
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}
	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://auth-lemonde3-0:8081/login", loginParams)
	if err != nil {
		logger.Error(err.Error())
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetMyInfo godoc
// @Schemes
// @Description Return the connected user's information
// @Tags authentication
// @Accept json
// @Produce json
// @Success 200 {object} User
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /users/me [get]
func GetMyInfo(c *gin.Context, logger *zap.Logger) {
	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://auth-lemonde3-0:8081/users/me", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetUser godoc
// @Schemes
// @Description Return a user's information
// @Tags authentication
// @Accept json
// @Produce json
// @Success 200 {object} User
// @Failure      400  {object}  HTTPError400
// @Failure      400  {object}  HTTPError403
// @Failure      500  {object}  HTTPError500
// @Router /users/:id [get]
func GetUser(c *gin.Context, logger *zap.Logger) {
	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodGet, "http://auth-lemonde3-0:8081/users/"+c.Param("id"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// ChangeUserVisibility godoc
// @Schemes
// @Description Change the visibility of a user
// @Tags authentication
// @Accept json
// @Produce json
// @Success 200 {object} User
// @Failure      400  {object}  HTTPError400
// @Failure      400  {object}  HTTPError403
// @Failure      500  {object}  HTTPError500
// @Router /users/me/visibility [post]
func ChangeUserVisibility(c *gin.Context, logger *zap.Logger) {
	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPost, "http://auth-lemonde3-0:8081/users/me/visibility", nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}


// Change User Password godoc
// @Schemes
// @Description Change the password of a user
// @Tags authentication
// @Accept json
// @Produce json
// @Param ChangeUserPasswordInput body ChangeUserPasswordInput true "Params to change user password"
// @Success 200 {object} ChangeUserPasswordResponse
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /password [put]
func ChangeUserPassword(c *gin.Context, logger *zap.Logger) {
	var ChangeUserPasswordParams ChangeUserPasswordInput

	if err := c.ShouldBindJSON(&ChangeUserPasswordParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPut, "http://auth-lemonde3-0:8081/password", ChangeUserPasswordParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// Change User Name godoc
// @Schemes
// @Description Change the name of a user
// @Tags authentication
// @Accept json
// @Produce json
// @Param ChangeUsernameInput body ChangeUsernameInput true "Params to change user name"
// @Success 200 {object} ChangeUserNameResponse
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /username [put]
func ChangeUserName(c *gin.Context, logger *zap.Logger) {
	var ChangeUsernameParams ChangeUsernameInput

	if err := c.ShouldBindJSON(&ChangeUsernameParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPut, "http://auth-lemonde3-0:8081/username", ChangeUsernameParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// Change User Mail godoc
// @Schemes
// @Description Change the mail of a user
// @Tags authentication
// @Accept json
// @Produce json
// @Param ChangeUserMailInput body ChangeUserMailInput true "Params to change user mail"
// @Success 200 {object} ChangeUserMailResponse
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /mail [put]
func ChangeUserMail(c *gin.Context, logger *zap.Logger) {
	var changeUserMailParams ChangeUserMailInput

	if err := c.ShouldBindJSON(&changeUserMailParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPut, "http://auth-lemonde3-0:8081/mail", changeUserMailParams)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// GetUserInfoByUsername godoc
// @Schemes
// @Description Get a user information with the user username
// @Tags authentication
// @Accept json
// @Produce json
// @Success 200 {object} User
// @Failure      400  {object}  HTTPError400
// @Failure      500  {object}  HTTPError500
// @Router /users/:username [get]
func GetUserInfoByUsername(c *gin.Context, logger *zap.Logger) {
	responseBody, statusCode, err := utils.MakeHTTPRequest(c, http.MethodPut, "http://auth-lemonde3-0:8081/users/"+c.Param("username"), nil)
	if err != nil {
		c.String(statusCode, "Error making the request")
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

type LoginResponse struct {
	Token string `json:"token" example:"XXXXXXXXXXXXXXXXXXXX"`
}

type RegisterResponse struct {
	Created string `json:"created" example:"User created successfully"`
}

type ChangeUserPasswordResponse struct {
	Created string `json:"created" example:"User password changed"`
}

type ChangeUserMailResponse struct {
	Created string `json:"created" example:"User email changed"`
}

type ChangeUserNameResponse struct {
	Created string `json:"created" example:"User name changed"`
}