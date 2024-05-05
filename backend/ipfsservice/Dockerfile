FROM golang:1.21.1

# ENV CGO_ENABLED=1

WORKDIR /app

COPY . .

RUN go mod download

RUN go build . 

EXPOSE 8085

CMD ["./main"]