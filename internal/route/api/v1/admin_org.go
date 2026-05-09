package v1

import (
	"github.com/Explaimaus-Hash/GitHub-clone-/internal/context"
)

func adminCreateOrg(c *context.APIContext, form createOrgRequest) {
	createOrgForUser(c, form, getUserByParams(c))
}
