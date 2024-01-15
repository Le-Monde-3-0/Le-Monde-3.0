package articles

import (
	"github.com/gin-gonic/gin"
)

func ApplyAdminRoutes(public *gin.RouterGroup) {

	public.POST("/register", Register)

	public.POST("/login", Login)

	public.PUT("/username", ChangeUserName)
	public.PUT("/mail", ChangeUserMail)
	public.PUT("/password", ChangeUserPassword)
}
