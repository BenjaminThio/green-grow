export default function YzPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: "65px",
            textAlign: "center",
            color: "hsl(119,88%,44%)",
            marginBottom: "5px",
          }}
        >
          GreenGrow
        </div>

        <div
          style={{
            fontSize: "30px",
            textAlign: "center",
            color: "hsl(119, 64%, 70%)",
          }}
        >
          Plant.Protect.Grow.
        </div>
      </div>

      <div
        style={{
          marginBottom: "30px",
          backgroundColor: "rgb(219, 241, 215)",
          borderRadius: "10px",
          padding: "20px",
          minWidth: "250px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "8px",
            borderRadius: "10px",
            border: "2px solid black",
            color: "white",
            backgroundColor: "rgb(55, 225, 43)",
            minHeight: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
            fontSize: "25px",
          }}
        >
          Communication events
        </div>

        <div style={{ color: "rgb(2, 144, 4)", fontSize: "25px" }}>Subtitle</div>
        <div style={{ color: "rgb(107, 246, 83)", fontSize: "18px" }}>Desc</div>
        <div>Roll</div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Previous</div>
          <div>Next</div>
        </div>
      </div>

      <div>
        <div
          style={{
            backgroundColor: "bisque",
            borderRadius: "10px",
            minWidth: "200px",
            textAlign: "center",
            marginBottom: "3px",
            border: "2px solid black",
            padding: "5px",
          }}
        >
          Google
        </div>

        <div
          style={{
            backgroundColor: "bisque",
            borderRadius: "10px",
            minWidth: "200px",
            textAlign: "center",
            marginBottom: "3px",
            border: "2px solid black",
            padding: "5px",
          }}
        >
          Fb
        </div>

        <div
          style={{
            backgroundColor: "rgb(196, 207, 255)",
            borderRadius: "10px",
            minWidth: "200px",
            textAlign: "center",
            marginBottom: "3px",
            border: "2px solid black",
            padding: "5px",
          }}
        >
          Create
        </div>

        <div
          style={{
            backgroundColor: "rgb(196, 207, 255)",
            borderRadius: "10px",
            minWidth: "200px",
            textAlign: "center",
            marginBottom: "3px",
            border: "2px solid black",
            padding: "5px",
          }}
        >
          Sign
        </div>
      </div>
    </div>
  );
}