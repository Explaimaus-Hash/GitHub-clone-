package context

import (
	"github.com/Explaimaus-Hash/GitHub-clone-/internal/database"
)

type APIOrganization struct {
	Organization *database.User
	Team         *database.Team
}
