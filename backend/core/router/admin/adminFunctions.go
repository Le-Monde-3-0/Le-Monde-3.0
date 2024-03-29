package articles

import (
	"github.com/gin-gonic/gin"
	req "main/http"
	"net/http"
)

type RegisterInput struct {
	Email    string `json:"email" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
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

// @BasePath /api/v1

// Register godoc
// @Schemes
// @Description Create a user
// @Tags authentication
// @Accept json
// @Produce json
// @Param RegisterInput body RegisterInput true "Params to create an account"
// @Success 200 {object} RegisterResponse
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /register [post]
func Register(c *gin.Context) {

	var registerParams RegisterInput

	if err := c.ShouldBindJSON(&registerParams); err != nil {
		req.NewError(c, http.StatusBadRequest, err)
		return
	}
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPost, "http://admin-lemonde3-0:8081/register", registerParams)
	if err != nil {
		req.NewError(c, statusCode, err)
		return
	}
	c.Data(statusCode, "application/json", responseBody)
}

// Login godoc
// @Schemes
// @Description Get an authentication token
// @Tags authentication
// @Accept json
// @Produce json
// @Param LoginInput body LoginInput true "Params to login to account"
// @Success 200 {object} LoginResponse
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /login [post]
func Login(c *gin.Context) {
	var loginParams LoginInput

	if err := c.ShouldBindJSON(&loginParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}
	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPost, "http://admin-lemonde3-0:8081/login", loginParams)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /password [put]
func ChangeUserPassword(c *gin.Context) {
	var ChangeUserPasswordParams ChangeUserPasswordInput

	if err := c.ShouldBindJSON(&ChangeUserPasswordParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPut, "http://admin-lemonde3-0:8081/password", ChangeUserPasswordParams)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /username [put]
func ChangeUserName(c *gin.Context) {
	var ChangeUsernameParams ChangeUsernameInput

	if err := c.ShouldBindJSON(&ChangeUsernameParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPut, "http://admin-lemonde3-0:8081/username", ChangeUsernameParams)
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
// @Failure      400  {object}  req.HTTPError
// @Failure      500  {object}  req.HTTPError
// @Router /mail [put]
func ChangeUserMail(c *gin.Context) {
	var changeUserMailParams ChangeUserMailInput

	if err := c.ShouldBindJSON(&changeUserMailParams); err != nil {
		c.String(http.StatusBadRequest, "Invalid request body")
		return
	}

	responseBody, statusCode, err := req.MakeHTTPRequest(c, http.MethodPut, "http://admin-lemonde3-0:8081/mail", changeUserMailParams)
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
