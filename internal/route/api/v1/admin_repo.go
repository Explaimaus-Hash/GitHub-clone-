package v1

import (
	"github.com/Explaimaus-Hash/GitHub-clone-/internal/context"
)

func adminCreateRepo(c *context.APIContext, form createRepoRequest) {
	owner := getUserByParams(c)
	if c.Written() {
		return
	}

	createUserRepo(c, owner, form)
}
