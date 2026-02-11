package config

import (
	"log"

	"github.com/spf13/viper"
)

type Env struct {
	DATABASE_URL string `mapstructure:"DATABASE_URL"`
	PORT         string `mapstructure:"PORT"`
}

func NewEnv() *Env {
	env := Env{}

	viper.SetConfigFile(".env")

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("Can't find the file .env : ", err)
	}

	err = viper.Unmarshal(&env)
	if err != nil {
		log.Fatal("Environment can't be loaded: ", err)
	}

	return &env
}
