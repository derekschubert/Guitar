package util

import (
	"reflect"
)

// ConvertStructToSlice converts a struct into a slice of values. Any private fields in the struct are assigned a nil value
func ConvertStructToSlice(str interface{}) []interface{} {
	v := reflect.ValueOf(str)
	l := v.NumField()
	x := make([]interface{}, l)

	for i := 0; i < l; i++ {
		vi := v.Field(i)
		if vi.CanInterface() {
			x[i] = vi.Interface()
		}
	}

	return x
}
