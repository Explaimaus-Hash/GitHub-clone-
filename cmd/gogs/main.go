// CodeForge is a painless self-hosted Git Service.
package main

import (
	"context"
	"os"

	"github.com/urfave/cli/v3"
	log "unknwon.dev/clog/v2"

	"github.com/Explaimaus-Hash/GitHub-clone-/internal/conf"
)

func init() {
	conf.App.Version = "0.15.0+dev"
}

func main() {
	cmd := &cli.Command{
		Name:    "CodeForge",
		Usage:   "A self-hosted Git workspace",
		Version: conf.App.Version,
		Commands: []*cli.Command{
			&webCommand,
			&servCommand,
			&hookCommand,
			&adminCommand,
			&importCommand,
			&backupCommand,
			&restoreCommand,
		},
	}
	if err := cmd.Run(context.Background(), os.Args); err != nil {
		log.Fatal("Failed to start application: %v", err)
	}
}
